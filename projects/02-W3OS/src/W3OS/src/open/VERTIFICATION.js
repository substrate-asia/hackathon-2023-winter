import RUNTIME from "../lib/runtime";

let mine="";
let SVC=null;

const agent={

};

const VERTIFICATION={
    init:(ws)=>{
        RUNTIME.getAccount((fa)=>{
            if(!fa) return false;
            mine=fa.address;
            const cfg=RUNTIME.getConfig("system");
            const uri=cfg.basic.talking[0];
            RUNTIME.websocket(uri,(ws)=>{
              SVC=ws;
            },agent);
          });
    },
}

export default VERTIFICATION;