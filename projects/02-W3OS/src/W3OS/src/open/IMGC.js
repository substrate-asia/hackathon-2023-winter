import RUNTIME from "../lib/runtime";
import INDEXED from "../lib/indexed";
import tools from "../lib/tools";
import IO from "./IO";

let SVC=null;
let recoder=null;
let spam="";
let mine="";

//unique group format
const table = {
  table: "TABLE_NAME",
  keyPath: "id",
  map: {
    id: { unique: false },        // group id or account address
    type: { unique: false },      // data type
    last: { unique: false },      // last chat details
    update: { unique: false },    // last update stamp
    status: { unique: false },    // group/account status
    more: { unique: false },      // more information of Group/Account
  },
};


let DBname = "w3os_indexed";
let prefix = "group_";
const DB={
  setConfig: (name, pre) => {
    DBname = name;
    prefix = pre;
  },
  getTable: (name) => {
    const data = JSON.parse(JSON.stringify(table));
    data.table = name;
    return data;
  },
  save: (mine,id,data,ck)=>{
    const table = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (res) => {
      const tbs = res.objectStoreNames;
      const row = {
        id: id,
        type: data.type,
        last:data.last,
        update: tools.stamp(),
        status:1,
      };
      delete data.id;
      delete data.type;
      delete data.last;
      row.more=data;

      if (!INDEXED.checkTable(tbs,table)) {
        const tb = DB.getTable(table);
        INDEXED.initDB(DBname, [tb], res.version + 1).then((db) => {
          if(!db || !db.objectStoreNames || !INDEXED.checkTable(db.objectStoreNames,table)){
            return setTimeout(()=>{
              DB.save(mine,id,data,ck);
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
  update:(mine,rows,ck)=>{
    const table = `${prefix}${mine}`;
    console.log(`IMGC ready to update group details, table: ${table}`);
    INDEXED.checkDB(DBname, (db) => {
      if(!db || !db.objectStoreNames || !INDEXED.checkTable(db.objectStoreNames,table)){
        return setTimeout(()=>{
          DB.update(mine,rows,ck);
        },1000);
      }else{
        INDEXED.updateRow(db, table, rows, ck);
      }
    });
  },
  view:(mine,id,ck)=>{
    const table = `${prefix}${mine}`;
    INDEXED.checkDB(DBname, (db) => {
      INDEXED.searchRows(db, table, "id",id, (list)=>{
        if(list.length===1) return ck && ck(list[0]);
        return ck && ck(list);
      });
    });
  },
  page: (mine, page, ck) => {
    INDEXED.checkDB(DBname, (db) => {
      const tbs = db.objectStoreNames;
      const table = `${prefix}${mine}`;
      //console.log(table);
      if (!INDEXED.checkTable(tbs,table)) return ck && ck(false);
      const step = 20;
      INDEXED.pageRows(db, table, ck, { page: page, step: step });
    });
  },
  //put target group on top of the list
  groupList:(acc,id,data,ck)=>{
    const nlist=[data];
    RUNTIME.getTalking(acc,(list)=>{
      //console.log(list);
      for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row.id!==id){
          nlist.push(row);
        }else{
          console.log(row)
          if(!row.last.from && !row.last.msg) continue;
          nlist[0].last=row.last;
        } 
      }
       RUNTIME.setTalking(acc,nlist,ck);
    });
  },
}

const map={}
const self={
  send:(obj)=>{
    if(!spam) return false;
    obj.spam=spam;
    if(SVC!==null) SVC.send(JSON.stringify(obj));
    console.log(`Req: ${JSON.stringify(obj)}`);
    return true;
  },
  reg:()=>{
    const req={act:"active",acc:mine,spam:spam}
    self.send(req);
  },
  callbackKey:()=>{
    return `${tools.char(3)}_${tools.stamp()}`;
  },
  setCallback:(fun)=>{
    const key=self.callbackKey();
    map[key]=fun;
    return key;
  },
  getCallback:(key)=>{
    if(!map[key]) return false;
    return map[key];
  },
};

const router={
  //!important, when your friend create a group which you are included, then you will get a notice.
  //!important, there is no callback, but still need to create the target group
  group_create:(res,callback)=>{
    console.log(res);
    //1.update group index
    const data={
      id:res.id,
      type:"group",
      last:{
        from:"",
        msg:"",
      }
    }
    //console.log(data);
    DB.save(mine,res.id,data,()=>{
      const odata={
        id:res.id,
        type:"group",
        group:[mine],
        nick:"",
        update:tools.stamp(),
        last:{
          from:"",
          msg:"",
        }
      }

      //update the localstorage index here
      DB.groupList(mine,res.id,odata,(res)=>{
        //console.log(`Group oreder index saved`);
      });
    });

    //2.callback if there is
    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    } 
  },
  group_detail:(res,callback)=>{
    console.log(`Group details: ${JSON.stringify(res)}`);
    //1.check the group exsist
    const row={
      id:res.id,
      type:"group",
      last:{
        from:"",
        msg:"",
      },
      more:res,
      status:1,
      update:res.update,
    }
    delete res.id;
    delete res.update;

    DB.update(mine,[row],()=>{
      //console.log(`Group[${row.id}] updated.`);
      const odata={
        id:row.id,
        type:"group",
        group:res.group,
        nick:res.nick,
        update:row.update,
        last:{
          from:"",
          msg:"",
        }
      }

      //update the localstorage index here
      DB.groupList(mine,row.id,odata,(rs)=>{
        //2.callback if there is
        if(callback!==undefined){
          map[callback](res);
          delete map[callback];
        } 
      });
    });
  },
  group_divert:(res,callback)=>{
    //1.

    //2.callback if there is
    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },

  group_join:(res,callback)=>{
    //1.

    //2.callback if there is
    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },
  group_members:(res,callback)=>{
    console.log(res);
    console.log(callback);

    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },
  group_leave:(res,callback)=>{
    
    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },
  group_destory:(res,callback)=>{

    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },
  group_update:(res,callback)=>{

    //2.callback if there is
    if(callback!==undefined){
      map[callback](res);
      delete map[callback];
    }
  },
};

const decoder={
  try:(input)=>{
    if(recoder!==null) recoder(input);
    //console.log(`Here to check the input and call the method to deal with notice`);
    switch (input.type){
      case "notice":
        const name=`${input.method.cat}_${input.method.act}`;
        const callback=!input.method.callback?undefined:input.method.callback;
        
        if(router[name]) router[name](input.msg,callback);
        break;

      case "message":
        //1.send the message to acitve postman.
        const postman = RUNTIME.getMailer(!input.group?input.from:input.group);
        postman(input);
        
        break;

      case "error":
        const ck_error=!input.request.callback?undefined:input.request.callback;
        if(map[ck_error]){
          if(input.method) delete input.method;
          if(input.request) delete input.request;
          map[ck_error](input);
          delete map[ck_error];
        }else{
          //TODO, unreconginzed error process.
        }
        break;

      default:

        break;
    }
  },
};

// agent to websocket to accept the input
const agent={
  open:(res)=>{},
  message:(res)=>{
    console.warn(`!!! The raw message from websockekt: ${res.data}`);
    try {
      const input=JSON.parse(res.data);
      if(input.act==="init"){
        spam=input.spam;
        self.reg();
      }else{
        decoder.try(input);
      }
    } catch (error) {
        
    }
  },
  close:(res)=>{
    SVC=null;   //set websocket
    //console.log("closed")
  },
  error:(res)=>{
    //console.log(res);
  },
};


const IMGC={
  preInit:(acc,ck)=>{
    const table=`${prefix}${acc}`;
    const tb=DB.getTable(table);
    INDEXED.checkDB(DBname, (res) => {
      const tbs = res.objectStoreNames;
      return ck && ck(!INDEXED.checkTable(tbs,table)?tb:false);
    });
  },
  setRecoder:(fun)=>{
    recoder=fun;
  },
  init:(fun,ck,force,ignor)=>{
    if(fun) IMGC.setRecoder(fun); //set out recoder

    //Set IO decoder, get the parameters from URL
    //Support to join the group by QR
    IO.regOpen("IMGC",(params,UI)=>{
      console.log(params);
    });

    if(SVC!==null) return ck && ck(true);
    RUNTIME.getAccount((fa)=>{
      if(!fa) return false;
      mine=fa.address;
      const cfg=RUNTIME.getConfig("system");
      const uri=cfg.basic.talking[0];
      RUNTIME.websocket(uri,(ws)=>{
        SVC=ws;
        return ck && ck(true);
      },agent,force);

      if(!ignor){
        RUNTIME.wsClose(uri,(res)=>{
          console.log(`Websocket link closed, ready to reconnect.`);
          RUNTIME.wsRemove(uri);
          IMGC.init(fun,ck,force,true);
        });
      }
    });
  },
  group:{
    create:(accounts,ck)=>{
      //1.basic function
      const req={
        cat:"group",
        act:"create",
        list:accounts,
      }
      if(ck) req.callback=self.setCallback(ck); //2.callback support
      self.send(req);
    },
    detail:(id,ck)=>{
      const req={
        cat:"group",
        act:"detail",
        id:id,
      }
      if(ck) req.callback=self.setCallback(ck); //2.callback support
      self.send(req);
    },
    members:(id,ms,ck)=>{
      const req={
        cat:"group",
        act:"members",
        id:id,
        members:ms,
      }
      //2.callback support, added to the callback map
      if(ck) req.callback=self.setCallback(ck); 
      self.send(req);
    },
    join:(id)=>{

    },
    leave:(id,account,ck)=>{
      const req={
        cat:"group",
        act:"leave",
        id:id,
        account:account,
      }
      //2.callback support, added to the callback map
      if(ck) req.callback=self.setCallback(ck); 
      self.send(req);
    },
    divert:(id,account,ck)=>{
      const req={
        cat:"group",
        act:"divert",
        id:id,
        manager:account,
      }
      //2.callback support, added to the callback map
      if(ck) req.callback=self.setCallback(ck); 
      self.send(req);
    },

    destory:(id,ck)=>{
      const req={
        cat:"group",
        act:"destory",
        id:id,
      }
      //2.callback support, added to the callback map
      if(ck) req.callback=self.setCallback(ck);
      self.send(req);
    },
    chat:(ctx,to)=>{
      //console.log(`From ${mine} to ${to}: ${ctx}`);
      const req={
        cat:"group",
        act:"chat",
        to:to,
        msg:ctx,
      }
      self.send(req);
    },

    //!important, key/val string only
    //update target group parameter
    update:(id,key,val,ck)=>{   
      //1.struct the request format
      const req={
        cat:"group",
        act:"update",
        id:id,
        key:key,
        val:val,
      }

      //2.callback support, added to the callback map
      if(ck) req.callback=self.setCallback(ck);
      self.send(req);
    },
    
    switcher:(key,value)=>{

    },
  },
  chat:(ctx,to)=>{
    //console.log(`From ${mine} to ${to}: ${ctx}`);
    const req={
      cat:"chat",
      act:"chat",
      to:to,
      msg:ctx,
    }
    self.send(req);
  },
  vertify:{
    reg:(acc)=>{
      const req={
        cat:"vertify",
        act:"reg",
        account:acc,
      }
      self.send(req);
    },
  },
  list:(ck)=>{    //get the group list
    RUNTIME.getAccount((fa)=>{
      if(!fa) return false;
      mine=fa.address;

      let page=0;
      DB.page(mine,page,(res)=>{
        console.log(res);
      });
    });
  },
  local:{
    view:DB.view,
  },
}

export default IMGC;