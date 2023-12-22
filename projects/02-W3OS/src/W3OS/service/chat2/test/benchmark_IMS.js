//! Function test of W3OS IMS ( Instance Message Service );

//# Overview
// Will mock the target accounts to chat with each other.
// 1. record the send/receive amount to check IMS
// 2. will disconnect live account, to check IMS history functions

//## Running
// node benchmark_IMS.js

const { WebSocket } = require('ws');

const theme = {
    error: '\x1b[31m%s\x1b[0m',
    success: '\x1b[36m%s\x1b[0m',
    primary: '\x1b[33m%s\x1b[0m',
    dark: '\x1b[90m%s\x1b[0m',
};
const output =(ctx, type, skip) => {
    const stamp = () => { return new Date().toLocaleString(); };
    if (!type || !theme[type]) {
        if (skip) return console.log(ctx);
        console.log(`[${stamp()}] ` + ctx);
    } else {
        if (skip) return console.log(theme[type], ctx);
        console.log(theme[type], `[${stamp()}] ` + ctx);
    }
};
console.clear()
const start=new Date();
output(`Start to benchmark W3OS IMS ( Instance Message Service ) functions\n At ${start}`);

//setting part
const config={
    url:"ws://localhost:7788",
    account:1000,          //client numbers
};

const mock={
    ss58:(n)=>{

    },
}

const active={}         //active websocket links
const spams={}
const self={
    link:(url,amount,ck)=>{
        if(amount<1) return ck && ck();
        const ws=new WebSocket(url);
        ws.onopen=(res)=>{
            //output(`Link successful.`,"success",true);
        };
        ws.onmessage=(res)=>{
            try {
                const input=JSON.parse(res.data);
                spams[amount]=input.spam;
            } catch (error) {
                output(error,"error");
            }
        };
        ws.onclose=(res)=>{

        };
        ws.onerror=(res)=>{
            output(res,"error");
        };
        
        active[amount]=ws;
        amount--;
        return self.link(url,amount,ck);
    },
    send:(obj,index)=>{
        if(!active[index]) return false;
        const ws=active[index];
        ws.send(JSON.stringify(obj));
        return true;
    },
}
mock.ss58(config.account);
self.link(config.url,config.account,()=>{
    output(`Websockets link created, amount: ${config.account}`,"success",true);
    setTimeout(()=>{
        console.log(JSON.stringify(spams));
    },4000);
});

