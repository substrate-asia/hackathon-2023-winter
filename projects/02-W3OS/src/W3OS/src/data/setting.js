module.exports = {
  basic: {
    //OS basic parameters
    endpoint: ["ws://127.0.0.1:9944","wss://dev2.metanchor.net"],
    //endpoint: ["wss://dev2.metanchor.net","ws://127.0.0.1:9944"],
    name: "W3OS",
    desc: "Full on chain OS for Web3.0, base on Anchor Network.",
    version: "1.0.1",
    auth: ["Fuu"],
    loader: "loader.html",
    protocol: ["Easy Protocol"],
    avatar: ["https://robohash.org"],
    talking:["ws://127.0.0.1:7788","wss://chat.metanchor.net"],
    //talking:["wss://chat.metanchor.net","ws://127.0.0.1:7788"],
    theme:2,
  },
  APIs: {
    Polkadot: {
      latest: "anchor://polkadot",
      stable: "anchor://polkadot",
    },
    anchorJS: {
      latest: "anchor://anchorjs",
      stable: "anchor://anchorjs",
    },
    Easy: {
      latest: "anchor://easy",
      stable: "anchor://easy",
    },
  },
  indexed: {
    db: "w3os_indexed", //w3os_indexed
    prefix: {
      chat: "chat_",        //chat record
      bill: "bill_",        //bill record
      talking:"talking_",   //group record
    },
  },
  storage: {
    //localstorage key definition
    contact: "w3os_contact",
    apps: "w3os_apps",
    accounts: "w3os_account",
    system: "w3os_system",
  },
  format: {
    //basic data structure
    app: {
      //app basic information
      name: "account",
      src: "",
      block: 0,
      base: false, //system apps
      status: "normal",
      type: "app", //["system","app"]
      grid: {
        size: [1, 1],
        position: [0, 0],
      },
      icon: "icons/default.png",
      short: "Name",
      desc: "",
    },
    contact: {
      //contact data structure
      intro: "W3OS contact service",
      server: ["ws://127.0.0.1:7788"],
      status: "",
      type: "friend",
      network: "Anchor",
    },
    account: {
      //account data structure
      address: "5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw",
      short: "",
      type: [],
      file: "",
    },
  },
  network: {
    //support networks
    anchor: ["ws://127.0.0.1:9944", "wss://dev.metanchor.net"],
    polkadot: [],
    bitcoin: [],
  },
  apps: {
    contact: {
      node: [
        "wss://chat.metanchor.net",
        "ws://android.im:7788",
        "ws://45.63.91.147:7788",
        "ws://localhost:7788",
      ],
      max: 500,
      permit: {},
      format: "png",
    },
    account: {
      max: 10,
      format: "png",
    },
    talking:{
      AI:"",
    },
    trend: {
      list: ["BTC", "ETH", "DOT"],
      node: ["ws://localhost:7788", "wss://hub.metanchor.net"],
      link: "anchor://trend",
    },
    lottery: {
      network: "Anchor",
      interval: 600,
      node: ["ws://127.0.0.1:1688", "ws://127.0.0.1:9944"],
    },
  },
};
