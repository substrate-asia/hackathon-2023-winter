import INDEXED from "./indexed";
import tools from "./tools";

//const DBname = "w3os_history";
let DBname = "w3os_indexed";
let prefix = "bill_";

const table = {
  table: "TABLE_NAME",
  keyPath: "hash",
  map: {
    to: { unique: false },
    block: { unique: false },
    hash: { unique: false },
    more: { unique: false },
    stamp: { unique: false },
    status: { unique: false },
  },
};
const BILL = {
  preInit:(acc,ck)=>{
    const table=`${prefix}${acc}`;
    const tb=BILL.getTable(table);
    INDEXED.checkDB(DBname, (res) => {
      const tbs = res.objectStoreNames;
      return ck && ck(!INDEXED.checkTable(tbs,table)?tb:false);
    });
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
  save: (mine, to, details, ck) => {
    const table = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (res) => {
      const tbs = res.objectStoreNames;
      const row = {
        to: to,
        amount: details.amount,
        block: details.block ? details.block : "",
        hash: details.hash ? details.hash : "",
        more: null,
        stamp: tools.stamp(),
        status: details.status ? details.status : "unknown",
      };
      console.log(tbs);
      if (!BILL.checkTable(table, tbs)) {
        const tb = BILL.getTable(table);
        INDEXED.initDB(DBname, [tb], res.version + 1).then((db) => {
          if(!INDEXED.checkTable(table,db.objectStoreNames)){
            return setTimeout(()=>{
              console.log(`Retry to insert paybill row`);
              INDEXED.insertRow(db, table, [row]);
              return ck && ck();
            },1000);
          }else{
            INDEXED.insertRow(db, table, [row]);
            return ck && ck();
          }
        });
      } else {
        INDEXED.insertRow(res, table, [row]);
        return ck && ck();
      }
    });
  },
  update: (mine, rows, ck) => {
    const table = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (db) => {
      if(!INDEXED.checkTable(table,db.objectStoreNames)){
        return setTimeout(()=>{
          console.log(`Retry to update`);
          INDEXED.updateRow(db, table, rows, ck);
        },1000);
      }else{
        INDEXED.updateRow(db, table, rows, ck);
      }
    });
  },
  page: (mine, page, ck) => {
    INDEXED.checkDB(DBname, (db) => {
      const tbs = db.objectStoreNames;
      const table = `${prefix}${mine}`;
      if (!BILL.checkTable(table, tbs)) return ck && ck(false);
      const step = 20;
      INDEXED.pageRows(db, table, ck, { page: page, step: step });
    });
  },
  checkTable: (from, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === from) return true;
    }
    return false;
  },
};

export default BILL;
