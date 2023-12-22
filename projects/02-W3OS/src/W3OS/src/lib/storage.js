import Encry from "./encry";

const map = {};
const persist = {}; //通过支付串化，进行数据保存

const ignore = {
  //ignore encry list
};
let hash = "";

const STORAGE = {
  dump: () => {
    return {
      storage: map,
      persist: persist,
    };
  },
  getEncry: () => {
    return hash;
  },
  setEncry: (md5) => {
    hash = md5;
    Encry.auto(md5);
    return true;
  },
  clearEncry: () => {
    hash = "";
  },
  setIgnore: (list) => {
    for (let i = 0; i < list.length; i++) ignore[list[i]] = true;
    return true;
  },
  setMap: (obj) => {
    for (var k in obj) map[k] = obj[k];
    return true;
  },
  checkMap:(key)=>{
    if(map[key]) return true;
    return false;
  },

  removeKey: (name) => {
    if (!map[name]) return false;
    const key = map[name];
    localStorage.removeItem(key);
    return true;
  },

  setPersist: (name, obj) => {
    persist[name] = JSON.stringify(obj);
  },
  getPersist: (name) => {
    if (!persist[name]) return null;
    return JSON.parse(persist[name]);
  },
  removePersist: (name) => {
    delete persist[name];
    return true;
  },

  //key-value
  exsistKey: (name) => {
    if (!map[name]) return null;
    const key = map[name];
    const str = localStorage.getItem(key);
    if (str === null) return false;
    return true;
  },

  getKey: (name) => {
    //console.log(map);
    if (!map[name]) return null;
    const key = map[name];
    const str = localStorage.getItem(key);
    if (str === null) return null;

    //console.log(str);
    //console.log(hash);
    if (!hash || ignore[name] === true) {
      try {
        return JSON.parse(str);
      } catch (error) {
        return false;
      }
    }

    const res = Encry.decrypt(str);
    if (!res) return false;
    return JSON.parse(res);
  },
  setKey: (name, obj) => {
    //console.log(map);
    if (!map[name]) return false;
    const key = map[name];
    if (!hash || ignore[name] === true){
      return localStorage.setItem(key, JSON.stringify(obj));
    }
    Encry.auto(hash);
    const res = Encry.encrypt(JSON.stringify(obj));
    localStorage.setItem(key, res);
  },

  getNode: (name, node) => {
    const data = STORAGE.getKey(name);
    if (data === null) return false;
    if (!data[node]) return null;
    return data[node];
  },
  setNode: (name, node, val) => {
    const data = STORAGE.getKey(name);
    if (data === null) return false;
    data[node] = val;
    STORAGE.setKey(name, data);
  },

  //key-queue
  getQueue: (name) => {
    if (!map[name]) return [];
    const key = map[name];
    const str = localStorage.getItem(key);
    if (str === null) return [];
    return JSON.parse(str);
  },
  footQueue: (name, atom) => {
    if (!map[name]) return [];
    const key = map[name];
    const qu = STORAGE.getQueue(name);
    qu.push(atom);
    localStorage.setItem(key, JSON.stringify(qu));
    return true;
  },
  headQueue: (name, atom) => {
    if (!map[name]) return [];
    const key = map[name];
    const qu = STORAGE.getQueue(name);
    qu.unshift(atom);
    localStorage.setItem(key, JSON.stringify(qu));
    return true;
  },
};

export default STORAGE;
