//! Function test of W3OS IMS ( Instance Message Service );

//# Overview
// Will mock the target accounts to chat with each other.
// 1. record the send/receive amount to check IMS
// 2. will disconnect live account, to check IMS history functions

//## Running
// node benchmark_IMS.js

const { WebSocket } = require('ws');
const tools = require('../common/tools');
const {output} = require('../common/output');

console.clear()
const start=new Date();
output(`Start to benchmark W3OS IMS ( Instance Message Service ) functions\n At ${start}`);

//setting part
const config={
    url:"ws://localhost:7788",      //IMS and GCS server URL
    account:10,                     //client numbers
};

const env={
    accounts:[],            //all mock accounts
    active:{},              //before reg, the websocket links
    spams:{},               //before reg, the spam to active websocket map
    spamToWebsocket:{},     //spam to websocket map
    accountToSpam:{},       //account to spam map
    groups:[],              //all created group IDs
    details:{},             //all created group details
    send:null,              //message send function
}


const mock={
    accounts:(n)=>{
        const list=[];
        for(let i=0;i<n;i++){
            list.push(mock.ss58("5mock"));
        }
        return list;
    },
    ss58:(pre)=>{
        const str="abcdefghijkmnopqrstuvwxyz23456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
        let acc=!pre?"":pre;
        const max=!pre?48:48-pre.length;
        for(let i=0;i<max;i++){
            acc+=str[tools.rand(0,str.length-1)];
        }
        return acc;
    },
}

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
                env.spams[amount]=input.spam;
            } catch (error) {
                output(error,"error");
            }
        };
        ws.onclose=(res)=>{

        };
        ws.onerror=(res)=>{
            output(res,"error");
        };
        
        env.active[amount]=ws;
        //console.log(amount);
        amount--;
        return self.link(url,amount,ck);
    },
    reg:(accs,ck)=>{
        for(let i=accs.length;i>0;i--){
            const ss58=accs[i-1],spam=env.spams[i-1];
            env.spamToWebsocket[spam]=env.active[i];
            env.accountToSpam[ss58]=spam;
            const req={
                act:"active",
                acc:ss58,
                spam:spam,
            }
            self.first(req,i);
        }
        return ck && ck();
    },
    first:(obj,index)=>{
        if(!env.active[index]) return false;
        const ws=env.active[index];
        ws.send(JSON.stringify(obj));
        return true;
    },
    send:(obj,spam)=>{
        if(!env.spamToWebsocket[spam]) return false;
        const ws=env.spamToWebsocket[spam];
        ws.send(JSON.stringify(obj));
        return true;
    },
    run:(funs,ck,len)=>{
        if(!len) len=funs.length;
        if(funs.length===0) return ck && ck();
        const fun=funs.shift();
        fun(env,len-funs.length-1,()=>{
            if(funs.length>0) output(`Ready to next test, 2s later...`);
            setTimeout(()=>{
                self.run(funs,ck,len);
            },2000);
        });
    },
}

/*************************************************/
/****** prepare the env then start to test *******/
/*************************************************/

env.accounts=mock.accounts(config.account);
//output(`Mocked accounts: ${JSON.stringify(env.accounts)}`);
self.link(config.url,config.account,()=>{
    const at=2;
    output(`Websockets link created, amount: ${config.account}`,"success",true);
    output(`Please hold ${at}s to wait the websocket ready.`,"info",true);
    setTimeout(()=>{
        self.reg(env.accounts,()=>{
            output(`Mock accounts are related to Websocket\n`,"success",true);
            output(`Ready to run tests.`,"info",true);
            env.send=self.send;

            //group test cases here, then run the test
            const {test_group_create}=require("./GCS/group_create");
            const {test_group_details}=require("./GCS/group_detail");
            const {test_group_join_free}=require("./GCS/group_join");
            const {test_group_leave}=require("./GCS/group_leave");
            const {test_manager_divert}=require("./GCS/group_divert");
            const {test_manager_deport}=require("./GCS/group_deport");
            const {test_manager_recover}=require("./GCS/group_recover");
            const {test_group_destory}=require("./GCS/group_destory");
            const {test_group_message}=require("./GCS/group_message");

            const ts=[
                test_group_create,
                test_group_join_free,
                //test_group_join_free,
                //test_group_leave,
                test_group_details,
                //test_manager_divert,
                //test_manager_deport,
                //test_manager_recover,
                //test_group_details,
                //test_group_destory,
                //test_group_message,
            ]

            const test_start=tools.stamp();
            self.run(ts,()=>{
                const test_end=tools.stamp();
                output(`All test cases done. Cost: ${(test_end-test_start).toLocaleString()}ms`);
            });
        });
    },at*1000);
});