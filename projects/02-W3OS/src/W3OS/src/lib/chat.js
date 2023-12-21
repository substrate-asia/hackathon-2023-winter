import INDEXED from "./indexed";
import tools from "./tools";

//const DBname='w3os_history';
let DBname = "w3os_indexed";
let prefix = "chat_";

const table = {
  table: "TABLE_NAME",
  keyPath: "stamp",
  map: {
    address: { unique: false },
    way: { unique: false },
    stamp: { unique: false },
    status: { unique: false },
  },
};

const status = {
  UNREAD: 3,
  NORMAL: 1,
  REMOVE: 0,
};

const map = {};


let queue = [];     //queue to cache the chat records
let lock = false;   //locker to insert IndexedDB

const CHAT = {
  preInit: (acc, ck) => {
    const table = `${prefix}${acc}`;
    const tb = CHAT.getTable(table);
    INDEXED.checkDB(DBname, (res) => {
      const tbs = res.objectStoreNames;
      return ck && ck(!INDEXED.checkTable(tbs, table) ? tb : false);
    });
  },
  friends: (fs) => {
    //set friend list
    for (var k in fs) map[k] = true;
  },
  setConfig: (name, pre) => {
    DBname = name;
    prefix = pre;
  },
  getTable: (name) => {
    const data = JSON.parse(JSON.stringify(table));
    data.table = name;
    return data;
  },
  //!important, here to cache the chat insert queue to avoid missing messages.
  write:(table,rows,from,ck)=>{
    lock = true;

    INDEXED.checkDB(DBname, (res) => {
      if(!res){
        lock=false;
        return ck && ck({error:"failed to write DB"});
      }

      const tbs = res.objectStoreNames;
      const nlist = JSON.parse(JSON.stringify(queue));
      for(let i=0;i<rows.length;i++){
        const row=rows[i];
        nlist.push(row);
      }
      queue = [];
      
      if (!INDEXED.checkTable(tbs, table)) {
        const tb = CHAT.getTable(table);
        INDEXED.initDB(DBname, [tb], res.version + 1).then((db) => {
          INDEXED.insertRow(db, table, nlist, () => {
            lock = false;
            console.log("Done, chat saved.");
            if(queue.length!==0){
              console.log("Dealing with queue.");
              const rs = JSON.parse(JSON.stringify(queue));
              queue=[];
              CHAT.write(table,rs,from);    //skip the callback
            }
          });
          return ck && ck(map[from] ? true : from);   //callback before write to DB really
        });
      } else {
        INDEXED.insertRow(res, table, nlist, () => {
          lock = false;
          console.log("Done, chat saved.");
          if(queue.length!==0){
            console.log("Dealing with queue.");
            const rs = JSON.parse(JSON.stringify(queue));
            queue=[];
            CHAT.write(table,rs,from);     //skip the callback
          }
        });
        return ck && ck(map[from] ? true : from);   //callback before write to DB really
      }
    });
  },
  save: (mine, from, ctx, way, group, un, ck) => {
    console.log(`My account: ${mine}, from: ${from}, way: ${way}, group:${group}, un: ${un}, content: ${ctx}`);
    let row = null;
    const state = way === "to" ? status.NORMAL : (!un ? status.UNREAD : status.NORMAL);
    //console.log(state,from,un);
    if (!group) {
      row = {
        address: from,
        msg: ctx,
        status: state,
        way: way,
        stamp: tools.stamp(),
      };
    } else {
      row = {
        address: group,
        from: from,
        msg: ctx,
        status: state,
        way: way,
        stamp: tools.stamp(),
      };
    }

    //FIXME,need to category by from address, to avoid write wrong rows.
    // will fix this after hackthon
    if (lock) {
      queue.push(row);
      return ck && ck({ status: "pending" });
    }
    const table = `${prefix}${mine}`;
    CHAT.write(table,[row],from,ck);
  },
  page: (mine, from, step, page, ck) => {
    INDEXED.checkDB(DBname, (db) => {
      const target = `${prefix}${mine}`;
      console.log(`here? target: ${target}`);
      const tbs = db.objectStoreNames;
      if (!INDEXED.checkTable(tbs, target)) return ck && ck(false);
      INDEXED.searchRows(db, target, "address", from, ck);
    });
  },

  unread: (mine, from, ck) => {
    const status = 3;
    const target = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (db) => {
      INDEXED.countRows(db, target, "address", from, status, ck);
    });
  },

  toread: (mine, rows, ck) => {
    const target = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (db) => {
      INDEXED.updateRow(db, target, rows, ck);
    });
  }
};

export default CHAT;
