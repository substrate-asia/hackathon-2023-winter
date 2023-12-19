const tools = require("./tools");      //comman websocket client management
const { output } = require("./output");
const History =require("./history");
const {task}=require("../service/std");

const clients = {};
const accountSpam = {}, spamToAccount = {};

//!important, the module of IMS and GCS will return the list of actions
//!important, client here to check the status and decode the task to do real work of network

const actions={
    message:(params,callback)=>{
        if(!accountSpam[params.to]){
            console.log(`${params.to} is not active, ready to push message history`);
            History.message(params.from, params.to, params.msg, !params.group?undefined:params.group);
        }else{
            params.type="message";
            self.send(params,accountSpam[params.to]);
        }
    },
    notice:(params,callback)=>{
        //console.log(`Here to push notice history`);
        //console.log(params);
        //console.log(callback);
        if(!accountSpam[params.to]){
            console.log(`${params.to} is not active, ready to push notice history`);
            const dt={method:params.method,data:params.msg};
            History.notice(params.from, params.to,dt,!params.group?undefined:params.group);
        }else{
            const data={}
            data.type="notice";
            data.msg=params.msg;
            data.method=params.method;
            if(callback!==undefined){
                data.method.callback=callback;
            }
            self.success(data,accountSpam[params.to]);
        }
    },
    announce:(params,callback)=>{
        const data={}
        data.type="announce";
    }
}

const self = {
    send: (obj, spam, order) => {
        if (!clients[spam]) return false;
        if (order !== undefined) obj.order = order;
        clients[spam].websocket.send(JSON.stringify(obj));
    },
    success: (obj, spam, order) => {
        //obj.success = true;
        self.send(obj, spam, order);
    },
    failed: (obj, spam, order) => {
        obj.type = "error";
        self.send(obj, spam, order);
    },
    decode:(list)=>{    //the task need to do
        if(Array.isArray(list)){
            for(let i=0;i<list.length;i++){
                const todo=list[i];
                console.log(`Todo:${JSON.stringify(todo)}`);
                if(actions[todo.action]){
                    actions[todo.action](todo.params,!todo.callback?undefined:todo.callback); 
                }else{
                    console.log(`success send directly`);
                }
            }
        }else{
            self.send(list, accountSpam[list.to]);
        }
    },
}

module.exports = {
    connection: (ws, ck) => {
        const uid = tools.char(12);
        clients[uid] = {
            websocket: ws,
            stamp: tools.stamp(),
            status: 1,              //[1.reg;2.payed;]     
            IP: "",
        }
        output(`Client linked, uid: ${uid} at ${new Date(clients[uid].stamp)}`, "success");
        ws.send(JSON.stringify({ "spam": uid, "act": "init" }));
        return ck && ck(uid);
    },
    close: (spam, res) => {
        delete clients[spam];
        const acc = spamToAccount[spam];
        delete spamToAccount[spam];
        delete accountSpam[acc];
        output(`Client removed, uid: ${spam}`, "error");
    },
    error: (err) => {
        output(`Error: ${err}`, "error");
    },
    message: (input, spam, delegate) => {
        //1.if active, link the spam to account;
        if (input.act === "active") {
            if (!input.acc) return output(`Invalid active. request: ${JSON.stringify(input)}`, "error");
            spamToAccount[spam] = input.acc;
            accountSpam[input.acc] = spam;
        } else {
            if (!spamToAccount[spam]) return output(`Unknown spam. request: ${JSON.stringify(input)}`, "error");
        }

        //2. find the right function to deal with the request
        const cat = !input.cat ? "chat" : input.cat;  //router to different service
        const act = input.act;                    //action 
        if (!delegate[cat] || !delegate[cat][act]) {
            return output(`Unknown request: ${JSON.stringify(input)}, to ${spam}`, "error");     //check spam
        }
        const fun = delegate[cat][act];
        delete input.act;
        delete input.cat;

        const result = fun(input,spamToAccount[spam]);
        console.log(`Service response:${JSON.stringify(result)}`);
        if (!result || result.error) {
            self.failed(result, spam);
        } else {
            self.decode(result);
        }
    },

    //sent notification to [account,...]
    notice:(arr,msg,method)=>{
        const list=[];
        for(let i=0;i<arr.length;i++){
            const account=arr[i];
            const todo=task("notice");
            todo.params.msg=msg;
            todo.params.to=account;
            todo.params.method=method;
            list.push(todo);
        }
        self.decode(list);
    },
};