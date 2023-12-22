import STORAGE from "./storage";
import tools from "./tools";
import Encry from "./encry";
import Config from "../data/setting";

import INDEXED from "./indexed";
import CHAT from "./chat";
import BILL from "./bill";
import IMGC from "../open/IMGC";


import { FcEngineering } from "react-icons/fc";
import { FcDataProtection } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { FcContacts } from "react-icons/fc";
import { FcPhone } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcLineChart } from "react-icons/fc";
import { FcMindMap } from "react-icons/fc";
import { FcOrgUnit } from "react-icons/fc";
import { FcMultipleDevices } from "react-icons/fc";
import { FcOrganization } from "react-icons/fc";
import { FcPodiumWithAudience } from "react-icons/fc";
import { FcSelfie } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";
import { FcPuzzle } from "react-icons/fc";
import { FcProcess } from "react-icons/fc";

const isize=66;
const icons=[
  <FcEngineering size={isize} />,
  <FcDataProtection size={isize} />,
  <FcMoneyTransfer size={isize}/>,
  <FcContacts size={isize}/>,
  <FcPhone size={isize}/>,
  <FcHome size={isize}/>,
  <FcLineChart size={isize}/>,    //app random icon from here
  <FcMindMap size={isize}/>,
  <FcOrgUnit size={isize}/>,
  <FcMultipleDevices size={isize}/>,
  <FcOrganization size={isize}/>,
  <FcPodiumWithAudience size={isize}/>,
  <FcSelfie size={isize}/>,
  <FcSalesPerformance size={isize}/>,
  <FcPuzzle size={isize}/>,
  <FcProcess size={isize}/>,
];

let API = null;
let wsAPI = null;   //Polkadot node link
let wss = {};       //servers links
let spams = {};
let nets = {};
let UI = null;
let mailer = {};    //mailer cache
let closing={};     //closing monitor

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
  getICON:(index)=>{
    if(icons[index]) return icons[index];
    return icons[0];
  },
  getRandomICON:()=>{
    return tools.rand(5,icons.length-1);
  },
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

    //1.first time to run W3OS
    if (salt === null) {
      const char = tools.char(28, prefix);
      STORAGE.setKey("salt", char);
    }

    //2.check wether no password
    salt = STORAGE.getKey("salt");
    const login = STORAGE.getEncry(); //check storage md5 password hash
    if (!login) {
      setPass((pass,fresh) => {
        const md5 = Encry.md5(`${salt}${pass}`);
        const check = STORAGE.getKey("vertify");
        //console.log(check);
        if (check === null) {
          //a. no password check, create one
          STORAGE.setEncry(md5);
          STORAGE.setKey("vertify", md5);
          if(fresh) fresh();    //if fresh, do it

        } else {
          //b. do have password
          if (check !== md5) return ck && ck({ msg: "Error password" });
          STORAGE.setEncry(md5);
          if(fresh) fresh();    //if fresh, do it
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
    //console.log(`Ready to init base indexedDB tables for account ${acc}, at ${tools.stamp().toLocaleString()}`);
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
      if(!list[address]){
        list[address] = {
          short: "",
          intro: "",
          status: 1,
          type: !stranger ? "friend" : "stranger",
          network: "Anchor",
        };
        if(!STORAGE.checkMap(nkey)){
          const nmap={};
          nmap[nkey]=`${prefix}_${nkey}`;
          STORAGE.setMap(nmap);
        }
        STORAGE.setKey(nkey, list);
        return ck && ck(true);
      }else{
        return ck && ck(true);
      }  
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
  setContact:(address,data,ck,stranger)=>{

    RUNTIME.getAccount((acc) => {
      if (!acc || !acc.address) return ck && ck(false);
      const mine = acc.address;
      RUNTIME.getContact((clist)=>{
        if(!clist[address]) return false;
        console.log(clist[address]);
        for(let k in clist[address]){
          if(data[k]) clist[address][k]=data[k];
        }
        const nkey = !stranger ? mine : `${mine}_stranger`;
        STORAGE.setKey(nkey, clist);
        return ck && ck(true);
      });
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
  wsClose:(uri,fun)=>{
    if(!closing[uri])closing[uri]=[];
    closing[uri].push(fun);
    return true;
  },
  websocket: (uri, ck, agent,force) => {
    if (wss[uri] && !force) return ck && ck(wss[uri]);

    if(force && wss[uri]){
      wss[uri].close();
    }

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
        if(closing[uri] && closing[uri].length!==0){
          for(let i=0;i<closing[uri].length;i++){
            closing[uri][i](res);
          }
        }
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

  /***************************************************************/
  /******************* Index update functions ********************/
  /***************************************************************/
  // getTalkingMastor:(way,from,to)=>{
  //   if(way==="to") return from;
  //   return to;
  // },
  isGroup: (address) => {
    if (address.length === 48) return false;
    return true;
  },
  newContact:()=>{
    return {
      id:"",                  //address unique id
      nick:"",                //nickname of contact
      update:0,   //group update time
      last:"",                //last message
      type:"contact",         //talking type
      un:0,
    }
  },
  newGroup:()=>{
    return {
      id:"",
      last:{
        from:"",
        msg:"",
      },
      update:0,
      type:"group",
      un:0,
    }
  },
  exsistID:(id,list)=>{
    console.log(`[exsistID] get the index of ${id} from ${JSON.stringify(list)}`)
    for(let i=0;i<list.length;i++){
      if(list[i].id===id) return i;
    }
    return null;
  },
  getAtomID:(way,from,to)=>{
    if(way==="to") return to;
    return from;
  },
  getAtomFromTalking:(way,from,to,ck)=>{
    console.log(`[getAtomFromTalking] From ${from}, to ${to}, way: ${way}`);
    //1.which account to update 
    
    RUNTIME.getAccount((fa)=>{
      //const key=RUNTIME.getTalkingMastor(way,from,to);
      const key=fa.address;
      console.log(`Account: ${key} need to update talking index.`);
      RUNTIME.getTalking(key,(list)=>{
  
        //2.check the atom ID
        if(to.length===48){
          //2.1. index order when contact
          const id=RUNTIME.getAtomID(way,from,to);
          const index=RUNTIME.exsistID(id,list);
          console.log(`Contact index: ${index}, ID: ${id}`);
          if(index===null){
            const atom=RUNTIME.newContact();
            atom.id=id;     //set the contact ID
            list.unshift(atom);
            return ck && ck(list);
          }else{
            const nlist=[list[index]];
            for(let i=0;i<list.length;i++){
              if(i!==index) nlist.push(list[i]);
            }
            return ck && ck(nlist);
          }
        }else{
          //2.2. index order when group
          const index=RUNTIME.exsistID(to,list);
          console.log(`Group index: ${index}`);
          if(index===null){
            const atom=RUNTIME.newGroup();
            atom.id=to;
            list.unshift(atom);
            return ck && ck(list);
          }else{
            const nlist=[list[index]];
            for(let i=0;i<list.length;i++){
              if(i!==index) nlist.push(list[i]);
            }
            return ck && ck(nlist);
          }
        }
      });
    });
  },
  updateTalkingIndex:(from,to,msg,ck,unread,way)=>{
    console.log(`From "RUNTIME.updateTalkingIndex":`);
    console.log(`From: ${from}, to: ${to}, unread: ${unread}, way: ${way}, message: ${msg}`);

    //1. order the talking list
    RUNTIME.getAtomFromTalking(way,from,to,(list)=>{
      console.log(`Ordered list: ${JSON.stringify(list)}`);

      //2.update the messages
      console.log(`[updateTalkingIndex] To: ${to}`);
      if(RUNTIME.isGroup(to)){
        console.log(list[0]);
        list[0].last.from=from;
        list[0].last.msg=msg;
      }else{  
        list[0].last=msg;
      }
      list[0].update=tools.stamp();

      //3.update the unread amount
      if(!list[0].un) list[0].un=0;
      if(unread) list[0].un=parseInt(list[0].un)+1;
      RUNTIME.getAccount((fa)=>{
        RUNTIME.setTalking(fa.address,list,ck);
      });
    });
  },
};

export default RUNTIME;
