import STORAGE from "./storage";
import tools from "./tools";
import Encry from "./encry";
import Config from "../data/setting";

import INDEXED from "./indexed";
import CHAT from "./chat";
import BILL from "./bill";
import IMGC from "../open/IMGC";


let API = null;
let wsAPI = null;
let wss = {};
let spams = {};
let nets = {};
let UI = null;
let mailer = {}; //mailer cache

let base="";  //avatar base URL
let type="";  //avatar type set

//keys and prefix for localstorage
const prefix = "w3os";
const keys = {
  account: `${prefix}_account_file`,
  stranger: `${prefix}_stranger_list`,
  apps: `${prefix}_apps_list`,
  salt: `${prefix}_salt`,
  vertify: `${prefix}_check`,
  //talking:`${prefix}_talking`,
};
STORAGE.setMap(keys);

//default OS setting
const config = {
  accounts: require("../data/accounts"),
  apps: require("../data/apps"), //Official Dapps
  contacts: require("../data/contacts"), //Official contact
  system: require("../data/setting"), //Official settings for both system and Dapps
};

// const AnchorJS = require("../../public/package/anchor.min");
// const Easy=require("../../public/package/easy.min");
// const Pok=require("../../public/package/polkadot.min");

const AnchorJS = window.AnchorJS;
const Easy = window.Easy;
const Pok = window.Polkadot;

const RUNTIME = {
  /************************************************/
  /********** System initialization ***************/
  /************************************************/
  //1. set the password for W3OS;
  //!important, if there is no password, the data will be encode by default salt.
  //!important, the storage will be fresh when the password changed
  init: (setPass, ck) => {
    //1. creat salt anyway.
    STORAGE.setIgnore(["salt", "vertify"]); //public data;
    let salt = STORAGE.getKey("salt");
    if (salt === null) {
      //1.first time to run W3OS
      const char = tools.char(28, prefix);
      STORAGE.setKey("salt", char);
    }
    salt = STORAGE.getKey("salt");
    const login = STORAGE.getEncry(); //check storage md5 password hash
    if (!login) {
      setPass((pass) => {
        const md5 = Encry.md5(`${salt}${pass}`);
        const check = STORAGE.getKey("vertify");
        //console.log(check);
        if (check === null) {
          //a. no password check, create one
          STORAGE.setEncry(md5);
          STORAGE.setKey("vertify", md5);
        } else {
          //b. no password check, create one
          if (check !== md5) return ck && ck({ msg: "Error password" });
          STORAGE.setEncry(md5);
          //console.log(`vertify:${check},pass:${md5}`);
          return ck && ck(true);
        }
      });
    }
  },
  checkPass:(pass)=>{
    const salt=STORAGE.getKey("salt");
    const md5 = Encry.md5(`${salt}${pass}`);
    const check = STORAGE.getKey("vertify");
    if(md5===check){
      STORAGE.setEncry(md5);
      return true;
    }
    return false;
  },
  isLogin: () => {
    return STORAGE.getEncry();
  },
  isSalted: () => {
    const salt = STORAGE.getKey("salt");
    //console.log(salt);
    return !salt ? false : true;
  },
  clean: () => {
    //1.clear all storage
    //2.clear all IndexedDB data
  },
  /************************************************/
  /************** System setting ******************/
  /************************************************/

  getConfig: (name) => {
    if (!name) return config;
    if (!config[name]) return false;
    return config[name];
  },

  getSetting: (ck) => {
    return ck && ck(config.system);
  },

  /************************************************/
  /************** Network status ******************/
  /************************************************/

  networkReg: (net, fun) => {
    nets[net] = fun;
    return true;
  },
  networkStatus: (net, ck) => {
    if (!nets[net]) return ck && ck(false);
    nets[net](ck);
  },

  /************************************************/
  /************* Account Functions ****************/
  /************************************************/
  getAccount: (ck) => {
    const fa = STORAGE.getKey("account");
    return ck && ck(fa);
  },
  setAccount: (obj) => {
    STORAGE.setKey("account", obj);
  },
  removeAccount: () => {
    STORAGE.removeKey("account");
    return true;
  },
  initAccount:(acc,ck)=>{
    console.log(`Ready to init base indexedDB tables for account ${acc}, at ${tools.stamp().toLocaleString()}`);
    const list=[];
    CHAT.preInit(acc,(tb_chat)=>{
      if(tb_chat!==false) list.push(tb_chat);
      BILL.preInit(acc,(tb_bill)=>{
        if(tb_bill!==false) list.push(tb_bill);
        IMGC.preInit(acc,(tb_group)=>{
          if(tb_group!==false) list.push(tb_group);
          if(list.length===0) return ck && ck(true);
          const DBname = "w3os_indexed";
          INDEXED.checkDB(DBname, (res) => {
            INDEXED.initDB(DBname, list, res.version + 1,ck)
          })
        });
      });
    });
  },

  /************************************************/
  /************* Contcat Functions ****************/
  /************************************************/

  //contact functions
  addContact: (address, ck, stranger) => {
    RUNTIME.getAccount((acc) => {
      if (!acc || !acc.address) return ck && ck(false);
      const mine = acc.address;
      const nkey = !stranger ? mine : `${mine}_stranger`;
      let list = STORAGE.getKey(nkey);
      if (list === null) list = {};
      list[address] = {
        intro: "",
        status: 1,
        type: !stranger ? "friend" : "stranger",
        network: "Anchor",
      };
      STORAGE.setKey(nkey, list);
      return ck && ck(true);
    });
  },
  removeContact: (list, ck, stranger) => {
    RUNTIME.getAccount((acc) => {
      if (!acc || !acc.address) return ck && ck(false);
      const mine = acc.address;
      const nkey = !stranger ? mine : `${mine}_stranger`;
      let map = STORAGE.getKey(nkey);
      if (map === null) map = {};
      for (let i = 0; i < list.length; i++) {
        const acc = list[i];
        if (map[acc]) delete map[acc];
      }
      STORAGE.setKey(nkey, map);

      return ck && ck(true);
    });
  },
  getContact: (ck, stranger) => {
    RUNTIME.getAccount((acc) => {
      if (!acc || !acc.address) return ck && ck(false);
      const mine = acc.address;
      const nmap = {};
      const skey = !stranger
        ? `${prefix}_${mine}`
        : `${prefix}_${mine}_stranger`;
      const nkey = !stranger ? mine : `${mine}_stranger`;
      nmap[nkey] = skey;
      STORAGE.setMap(nmap);

      const list = STORAGE.getKey(nkey);
      if (list === null) {
        STORAGE.setKey(nkey, !stranger ? config.contacts : {});
      }
      return ck && ck(STORAGE.getKey(nkey));
    });
  },
  singleContact:(address,ck,stranger)=>{
    RUNTIME.getContact((clist)=>{
      if(!clist[address]) return ck && ck(false);
      return ck && ck(clist[address]);
    },stranger);
  },
  clearContact: (ck, stranger) => {
    RUNTIME.getAccount((acc) => {
      if (!acc || !acc.address) return ck && ck(false);
      const mine = acc.address;
      const nkey = !stranger ? mine : `${mine}_stranger`;
      STORAGE.removeKey(nkey);
      return ck && ck(true);
    });
  },

  setMailer: (acc, fun) => {
    mailer[acc] = fun;
    return true;
  },
  exsistMailer:(acc)=>{
    if(mailer[acc]) return true;
    return false;
  },
  clearMailer:(acc)=>{
    if(mailer[acc]) delete mailer[acc];
    return true;
  },
  getMailer: (acc) => {
    if (!mailer[acc]) return false;
    return mailer[acc];
  },

  /************************************************/
  /*************** Talking Setting ****************/
  /************************************************/

  getTalking:(acc,ck)=>{
    if(typeof acc != "string") return false;
    const key=`talking_${acc}`;
    if(!STORAGE.checkMap(key)){
      const nmap={};
      nmap[key]=`${prefix}_talking_${acc}`;
      STORAGE.setMap(nmap);
    }

    const list = STORAGE.getKey(key);
    if (list === null) {
      STORAGE.setKey(key,[]);
    }
    return ck && ck(STORAGE.getKey(key));
  },
  setTalking:(acc,list,ck)=>{
    if(typeof acc != "string") return false;
    const key=`talking_${acc}`;
    if(!STORAGE.checkMap(key)){
      const nmap={};
      nmap[key]=`${prefix}_talking_${acc}`;
      STORAGE.setMap(nmap);
    }
    STORAGE.setKey(key,list);
    return ck && ck(true);
  },

  /************************************************/
  /************ Application Launch ****************/
  /************************************************/

  getApps: (ck) => {
    const key="apps";
    const list = STORAGE.getKey(key);
    if (list === null) {
      STORAGE.setKey(key, config.apps);
    }
    return ck && ck(STORAGE.getKey(key));
  },
  inArray: (index, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (parseInt(index) === arr[i]) return true;
    }
    return false;
  },
  removeApp: (map, ck) => {
    const key="apps";
    const list = STORAGE.getKey(key);
    //console.log(JSON.stringify(list));
    for (var page in map) {
      if (!list[page]) break;
      const todo = map[page];
      const nlist = [];
      for (let i = 0; i < list[page].length; i++) {
        const row = list[page][i];
        if (!RUNTIME.inArray(i, todo)) nlist.push(row);
      }
      list[page] = nlist;
      STORAGE.setKey(key, list);
      //console.log(nlist);
      return ck && ck(true);
    }
  },
  installApp: (obj, page, ck) => {
    const key="apps";
    const list = STORAGE.getKey(key);
    list[page].push(obj);
    STORAGE.setKey(key, list);
    return ck && ck(true);
  },
  clearApps: () => {
    const key="apps";
    STORAGE.removeKey(key);
  },
  formatApp: () => {
    const str = JSON.stringify(Config.format.app);
    return JSON.parse(str);
  },

  /************************************************/
  /************ Websocket Management **************/
  /************************************************/

  setSpam: (uri, spam) => {
    spams[uri] = spam;
  },
  getSpam: (uri) => {
    return spams[uri];
  },
  wsReg: (uri, linker) => {
    wss[uri] = linker;
    return true;
  },
  wsInstance: (uri) => {
    if (!wss[uri]) return false;
    return wss[uri];
  },
  wsCheck: (uri) => {
    if (!wss[uri]) return 99;
    return wss[uri].readyState;
  },
  wsRemove: (uri) => {
    if(!wss[uri]) return true;
    wss[uri].close();
    delete wss[uri];
    return true;
  },
  websocket: (uri, ck, agent) => {
    if (wss[uri]) return ck && ck(wss[uri]);
    try {
      const ws = new WebSocket(uri);
      ws.onopen = (res) => {
        if (agent && agent.open) agent.open(res);
      };
      ws.onmessage = (res) => {
        if (agent && agent.message) agent.message(res);
      };
      ws.onclose = (res) => {
        if (agent && agent.close) agent.close(res);
      };
      ws.onerror = (res) => {
        if (agent && agent.error) agent.error(res);
      };
      wss[uri] = ws;
      return ck && ck(ws);
    } catch (error) {
      return ck && ck(error);
      //return ck && ck(RUNTIME.getError("WEBSOCKET_LINK_ERROR"));
    }
  },

  /************************************************/
  /********* Network Websocket Functions **********/
  /************************************************/

  link: (endpoint, ck) => {
    if (wsAPI === null) {
      const WsProvider = API.Polkadot.WsProvider;
      const ApiPromise = API.Polkadot.ApiPromise;
      try {
        const provider = new WsProvider(endpoint);
        ApiPromise.create({ provider: provider }).then((PokLinker) => {
          wsAPI = PokLinker;
          RUNTIME.wsReg(endpoint, wsAPI);
          API.AnchorJS.set(wsAPI);
          ck && ck(API);
        });
      } catch (error) {
        ck && ck(false);
      }
    } else {
      ck && ck(API);
    }
  },
  getActive: (ck) => {
    if (wsAPI === null) {
      RUNTIME.getAPIs(() => {
        return ck && ck(wsAPI, API.Polkadot.Keyring);
      });
    } else {
      return ck && ck(wsAPI, API.Polkadot.Keyring);
    }
  },
  basicStatus: (ck) => {
    if (API.AnchorJS.ready) return ck && ck(API.AnchorJS.ready());
    return ck && ck(false);
  },

  /************************************************/
  /****************** Open APIs *******************/
  /************************************************/

  setUI: (funs) => {
    UI = funs;
  },
  getUI: ()=>{
    return UI;
  },
  getAPIs: (ck) => {
    if (API === null) {
      const easyAPI = {
        common: {
          latest: AnchorJS.latest,
          target: AnchorJS.target,
          history: AnchorJS.history,
          owner: AnchorJS.owner,
          subcribe: AnchorJS.subcribe,
          block: AnchorJS.block,
        },
      };
      API = {
        Polkadot: Pok,
        AnchorJS: AnchorJS,
        Easy: (anchorLinker, ck) => {
          Easy.easyRun(anchorLinker, easyAPI, ck);
        },
        system: {
          pay: (param, ck) => {
            //transaction API for cApps
            if (!param.amount) return ck && ck(false);
            //UI.dialog.show(<Vertify />);
          },
          write: () => {
            //anchor writing API for cApps
          },
        },
      };

      const endpoint = config.system.basic.endpoint[0];
      RUNTIME.networkReg("anchor", RUNTIME.basicStatus); //reg status function for Anchor Network
      return RUNTIME.link(endpoint, ck);
    }
    return ck && ck(API);
  },
  setAvatar:(uri,id)=>{
    base=uri;
    type="?set=set"+id;
    return true;
  },
  getAvatar:(str)=>{
    return `${base}/${str}.png${type}`;
  },
  updateTalkingIndex:(from,to,msg,ck,unread,way)=>{
    console.log(`From "RUNTIME.updateTalkingIndex":`);
    console.log(`From: ${from}, to: ${to}, unread: ${unread}, way: ${way}, message: ${msg}`);

    RUNTIME.getTalking(from,(list)=>{
      //console.log(list);
      let nlist=[];
      let target=null;

      //1. filter out the target group
      for(let i=0;i<list.length;i++){
        const row=list[i];
        if(to.length===48){
          if(row.id===to){
            target=row;
          }else{
            nlist.push(row);
          }
        }else{
          if(row.id===to){
            target=row;
          }else{
            nlist.push(row);
          }
        }
      }

      console.log(`The target is : ${JSON.stringify(target)}`);

      //2.update data
      if(target!==null){
        //2.1.regroup the index order
        if(target.type!=="group"){
          target.last=msg;
        }else{
          target.last.from=from;
          target.last.msg=msg;
        }
        target.update=tools.stamp();

        if(unread){
          if(!target.un) target.un=0;
          target.un++;
        }
        nlist.unshift(target);
      }else{

        //2.2.create new group here, need to get the details of group
        if(to.length===48){
          const contact={
            id:to,              //address unique id
            nick:"",            //nickname of contact
            update:tools.stamp(),         //group update time
            last:msg,            //last message
            type:"contact"      //talking type
          }
          nlist.unshift(contact);
        }else{
          const atom={
            id:to,
            last:{
              from:from,
              msg:msg,
            },
            update:tools.stamp(),
            type:"group",
          }

          if(unread){
            if(!target.un) target.un=0;
            atom.un++;
          }
          nlist.unshift(atom);
        }
      }

      RUNTIME.setTalking(from,nlist,ck);
    });
  },
};

export default RUNTIME;
