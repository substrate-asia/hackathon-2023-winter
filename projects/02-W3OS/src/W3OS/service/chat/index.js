//########## RUNNING ##########
// node index.js

// ## build command
// yarn add esbuild
// ../../node_modules/esbuild/bin/esbuild index.js --bundle --minify --outfile=./chat_server.min.js --platform=node

// ## abanded, runner will be on config.json
// node index.js config.json 5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw  

// ## server iptables
// iptables -I INPUT -p tcp --dport 7788 -j ACCEPT

const {output}=require("./lib/output");
const Valid = require("./lib/valid");       //check config file
const Chat=require("./IMS/chat");
const Paytovertify=require("./lib/paytovertify");
const Chain=require("./lib/chk_polkadot");
const History=require("./lib/history");

const version="1.0.1";
console.clear();
output(`W3OS IMS and GCS ( v${version} ) running...`,"dark",true);

Valid(process.argv.slice(2),(res)=>{
    const cfg=res.data;     //the config setting from config file.

    //1. start IMS
    Chain.endpoint(cfg.server.polkadot);    //set chain endpoint
    const agent={
        reg:(acc,ck)=>{
            output(`Ready to reg "${acc}"`);
            Paytovertify.account(cfg.server.vertification);
            Paytovertify.agent(
                (res)=>{    //when vertification successful
                    output(`Verification successful, ready to sent notification.`,"success");
                    Chat.notification(res.from,{status:1,msg:"Payment vertification successful"});
                },
                (res)=>{    //when vertification failed
                    output(`Verification failed, ready to sent notification.`,"error");
                    Chat.notification(res.from,{status:0,msg:"Payment vertification failed"});
                }
            );

            Paytovertify.subcribe(Chain.subcribe,Chain.convert);

            Paytovertify.add(acc,false,(amount)=>{
                output(`The pay amount is ${amount}`);
                return ck && ck(amount,cfg.server.vertification);
            });
        },
        active:(address,count)=>{
            History.clean(address,count);
            return true;
        },
        leave:()=>{

        },
        offline:(from,to,msg)=>{
            History.message(from,to,msg);
        },

        group:{
            create:(list)=>{

            },
            join:(acc,gid)=>{

            }, 
            leave:(acc,gid)=>{

            },
            list:(page,step)=>{

            },
            destrory:(gid)=>{

            },
        },
        get:{
            message:(address)=>{
                return History.mine(address);
            },
        }
    }
    Chat.init(cfg.server.port,agent);

    //2. start GCS, base on KOA, normal http request, data format JSON-RPC 2.0
    // const koa = require("koa");
    // const bodyParser = require("koa-bodyparser");
    // const koaRouter = require("koa-router");
    // const app = new koa(),router=new koaRouter();
    // const exposed = {
    //     call:{
    //         create:null,        // URI/create/ACCOUNT_ACCOUNT_ACCOUNT
    //         join:null,          // URI/join/GROUP_ID
    //         leave:null,         // URI/join/GROUP_ID
    //         list:null,
    //         destrory:null,
    //         spam:()=>{

    //         },
    //     },
    // }
    // const listen={
    //     run:(obj)=>{
    //         app.use(bodyParser({
    //             detectJSON: function (ctx) {
    //                 return ctx;
    //             }
    //         }));
            
    //         listen.http();
    //         app.use(router.routes());

    //         const port=obj.port;
    //         app.listen(port, () => {
    //             output(`[ GCS url ] http://localhost:${port}`,"primary",true);
    //             output(`Testing command lines:`,"",true);
    //             output(`curl "http://localhost:${port}" -d '{"jsonrpc":"2.0","method":"spam","id":3334}'`,"",true);
    //             output(`curl "http://localhost:${port}" -d '{"jsonrpc":"2.0","method":"list","params":{"page":1,"step":20},"id":3334}'`,"",true);
    //             output(`Enjoy the Group Chat Service.`,"success",true);
    //         });
    //     },
    //     http:()=>{
    //         router.get("/test", async (ctx) => {
    //             ctx.body = "hello, it works!";
    //         });

    //         router.post("/", async (ctx) => {
    //             const start = tools.stamp();
    //             const json=ctx.request.body;
    //             output(`--------------------------- request start ---------------------------`,"success",true);
    //             output(`[ call ] stamp: ${start}. Params : ${JSON.stringify(json)}`,"",true);
            
    //             const method = json.request.method;
    //             const IP = listen.getClientIP(ctx.req);
    //             if (method !== 'spam') {
    //                 if (!json.params.spam) return ctx.body = listen.export({ error: "no spam" }, json.request.id, json.callback);
    //                 const spam = json.request.params.spam;
    //                 const spamResult = listen.checkSpam(spam, IP);
    //                 if (spamResult !== true) {
    //                     return ctx.body = listen.export({ error: spamResult }, jsonp.request.id, jsonp.callback);
    //                 }
    //             }
                
    //             if (!method || !exposed.call[method]) {
    //                 return ctx.body = listen.export({ error: "unkown call" }, jsonp.request.id, jsonp.callback);
    //             }
            
    //             const env = { IP: IP };
    //             const result = await exposed.call[method](method, jsonp.request.params, jsonp.request.id, {}, env);
    //             ctx.body = listen.export(result, jsonp.request.id, jsonp.callback);
            
    //             const end = tools.stamp();
    //             output(`[ call ] stamp: ${end}, cost: ${end - start}ms, Result : ${JSON.stringify(result)}`,"",true);
    //             output(`---------------------------- request end ----------------------------\n`,"success",true);
    //         });
    //     },
    //     getParams: (str, pre) => {
    //         const map = {};
    //         if (!str) return map;
    //         const txt = str.replace(((!pre ? '' : pre) + "/?"), "");
    //         const arr = txt.split("&");
    //         for (let i = 0; i < arr.length; i++) {
    //             const kv = arr[i].split("=");
    //             map[kv[0]] = kv[1];
    //         }
    //         return map;
    //     },
    //     export: (data, id, callback) => {
    //         let output = { jsonrpc: '2.0', id: id };
    //         if (!data) {
    //             output.error = 'No response from server';
    //         } else {
    //             if (data.error) output.error = data.error;
    //         }
    
    //         if (output.error) return !callback ? output : `${callback}(${JSON.stringify(output)})`;
    //         output.result = data;
    //         return !callback ? output : `${callback}(${JSON.stringify(output)})`;
    //     },
    //     getClientIP: (req) => {
    //         let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    //             req.ip ||
    //             req.connection.remoteAddress || // 判断 connection 的远程 IP
    //             req.socket.remoteAddress || // 判断后端的 socket 的 IP
    //             req.connection.socket.remoteAddress || ''
    //         if (ip) {
    //             ip = ip.replace('::ffff:', '')
    //         }
    //         return ip;
    //     },
    //     getRequestURI: (port) => {
    //         const host="localhost";
    //         const uri = `http://${host}:${port}`;
    //         return uri;
    //     },
    // }

    // listen.run({port:7777});
});