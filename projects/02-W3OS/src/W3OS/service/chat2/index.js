//########## RUNNING ##########
// node index.js

//########## BUILD ##########
// yarn add esbuild
// ../../node_modules/esbuild/bin/esbuild index.js --bundle --minify --outfile=./chat_server.min.js --platform=node

// ## server iptables, without set the permit, firewall will block the request
// iptables -I INPUT -p tcp --dport 7788 -j ACCEPT

//########## LOADER ##########
// node loader.nodejs.js anchor://chat/

const { WebSocketServer } = require('ws');

const Valid = require("./common/valid");        //check config file
const Client = require("./common/client");      //comman websocket client management
const { output } = require("./common/output");  //console output function

const Chat = require("./service/chat");         //check config file
const Group = require("./service/group");       //check config file
const {error} = require("./service/std");       //Standard error message

const DB = require("./common/mndb");           //Memory DB
const History = require("./common/history");
const Recover = require("./service/recover");   //System backup and autosave function

const Paytovertify = require("./service/paytovertify");   //System backup and autosave function
const Chain=require("./service/network");
const {task}=require("./service/std");

//Functions group here.
const delegate={
    chat:{              //normal chat functions
        chat:Chat.to,               //single chat function
        to:Chat.to,                 //single chat function
        active:Chat.online,         //set the SS58 user active on server
        notice:null,
        offline:Chat.offline,       //set the SS58 user offline on server
        block:Chat.block,           //set the block SS58 list on server
    },
    group:{             //normal group functions
        create:Group.create,        //create a chat group, the owner must be in 
        detail:Group.detail,        //get the group detail by GID
        join:Group.join,            //join a target group with single account
        members:Group.members,        //check the accounts to join and leave from target group
        leave:Group.leave,          //leave a target group 
        divert:Group.divert,        //change the group manager
        deport:Group.deport,        //add account to the block list
        recover:Group.recover,      //remove account from block list
        destory:Group.destory,      //destory a group 
        chat:Group.message,         //chat in a group
        notice:Group.notice,        //sent notice to a target
        update:Group.update,        //update group parameters
    },
    vertify:{           //server vertification functions
        init:null,
        token:null,
        reg:(input,from)=>{
            output(`Ready to reg "${input.account}" from ${from}`);
            if(input.account!==from) return false;

            const vert=DB.hash_get("vertification",from);
            if(vert!==null){
                const todo=task("notice");
                todo.params.msg=vert
                todo.params.msg.done=true;
                todo.params.to=from;
                todo.params.method={
                    act:"reg",
                    cat:"vertify"
                };
                if(input.callback) todo.callback=input.callback;
                return [todo];
            }

            Paytovertify.agent(
                (res)=>{    //when vertification successful
                    output(`Verification successful, ready to sent notification.`,"success");
                    //Chat.notification(res.from,{status:1,msg:"Payment vertification successful"});
                    Client.notice([from],{data:"Vertification done"},{act:"done",cat:"vertify"});

                    //TODO, here to storage the vertification details.
                    //console.log(`Here to save the vertification details`);
                    //console.log(JSON.stringify(res));
                    delete res.from;
                    DB.hash_set("vertification",from,res);
                },
                (res)=>{    //when vertification failed
                    output(`Verification failed, ready to sent notification.`,"error");
                    //Chat.notification(res.from,{status:0,msg:"Payment vertification failed"});
                    Client.notice([from],{error:"Failed to vertify your account, please try again."},{act:"done",cat:"vertify"});
                }
            );
            
            Paytovertify.subcribe(Chain.subcribe,Chain.convert);

            const amount=Paytovertify.add(from,false);

            output(`The pay amount is ${amount}`);
            const todo=task("notice");
            todo.params.msg={
                amount:amount,
                account:Paytovertify.target(),
            };
            todo.params.to=from;
            todo.params.method={
                act:"reg",
                cat:"vertify"
            };
            if(input.callback) todo.callback=input.callback;
            return [todo];
        }
    },
    debug:{             //debug functions
        status:null,
    }
}
const empty=(obj)=>{
    for(var k in obj) return false;
    return true;
}

const getData=()=>{
    const gs=DB.key_dump();
    const his=History.dump();
    const ver_data=DB.hash_all("vertification");
    return {history:his,group:gs,vertification:ver_data}
};

const setData=(json)=>{
    if(json.group && !empty(json.group)){
        for(var k in json.group){
            DB.key_set(k,JSON.parse(JSON.stringify(json.group[k])));
        }
        output(`Group information recoverd`, "primary", true);
    }

    if(json.history && !empty(json.history)){
        History.recover(json.history);
        output(`Chat history recoverd`, "primary", true);
    }

    if(json.vertification && !empty(json.vertification)){
        DB.hash_recover("vertification",json.vertification);
        output(`vertification recoverd`, "primary", true);
    }
};

Valid(process.argv.slice(2),(res)=>{
    if(res.error) return output(`Error:${JSON.stringify(res)}`,"error",true);
    if(!res.data || !res.data.server || !res.data.server.port)  return output(`Invalid config file.`,"error",true);
    const cfg=res.data;
    const port=cfg.server.port;

    const ver_addres=cfg.server.vertification;
    output(`Set vertification account ${ver_addres}`, "primary", true);

    //Pay to vertify service basic setting.
    Paytovertify.account(ver_addres);       //set vertify account here
    Chain.endpoint(cfg.server.polkadot);    //set chain endpoint

    Recover(getData,setData,()=>{
        try {
            //1.create websocket linker.
            const wss = new WebSocketServer({ port: port});
            output(`W3OS IMS and GCS server start on ${port}.`, "dark", true);
            output(`ws://127.0.0.1:${port}`, "primary", true);
            
            wss.on('connection',(ws,request,client)=>{
                Client.connection(ws,(uid)=>{
                    ws.on('close', (res) => {
                        Client.close(uid,res);
                    });
                    ws.on('error', (err) => {
                        Client.error(err);
                    });
                    ws.on('message', (res)=>{
                        const str = res.toString();
                        if (!str) return output(`Empty request.`, "error");
                        try {
                            const input = JSON.parse(str);
                            if(!input.spam) return output(error("SYSTEM_INVALID_REQUEST"), "error");     //check spam
                            if(input.spam!==uid) return output(`Invalid spam.`, "error");     //check spam
                            delete input.spam;
                            Client.message(input,uid,delegate);
                        }catch (error) {
                            output(`Error: ${error}`, "error");
                        }
                    });
                });
            });
    
    
        } catch (error) {
            output(`Failed to create Websocket server on ${port}.`, "error", true);
        }
    });
});