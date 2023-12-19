// chat server , nodeJS
// Basic server framework
const { ApiPromise, WsProvider } = require('@polkadot/api');

const { WebSocketServer } = require('ws');
const port = 7788;
const wss = new WebSocketServer({ port: port });
const tools = require("../lib/tools");
console.log(`[ WS url ] http://localhost:${port}`);

const clients = {};
const amap = {}, bmap = {};

const self = {
    send: (obj, spam, order) => {
        if (!clients[spam]) return false;
        obj.order = order;
        clients[spam].send(JSON.stringify(obj));
    },
    success: (spam, order) => {
        self.send({ status: 1 }, spam, order);
    },
    failed: (spam, order) => {
        self.send({ status: 0 }, spam, order);
    },
};


const verify = require('../lib/paytovertify');
//active the PayToVertify
//verify.agent((res)=>{console.log(res)},(res)=>{console.log(res)});
// verify.subcribe((ck)=>{
    
// });

const actions = {
    verify: verify.add,
    reg: () => { },
    chat: () => { },
}

wss.on('connection', (ws, request, client) => {
    const uid = tools.char(12);
    clients[uid] = ws;

    ws.send(JSON.stringify({ "spam": uid, "act": "init" }));
    ws.on('error', console.error);
    ws.on('message', function message(res) {
        const str = res.toString();
        console.log(str);
        if (!str) return false;

        try {
            const input = JSON.parse(str);
            switch (input.act) {
                case "reg":
                    amap[input.acc] = input.spam;
                    bmap[input.spam] = input.acc;
                    self.success(input.spam, input.order);
                    break;
                case "chat":
                    const to = input.to;
                    console.log(amap[to]);
                    if (!clients[amap[to]]) {
                        return self.failed(input.spam, input.order);
                    }
                    self.send({ act: "chat", msg: input.msg, from: bmap[input.spam] }, amap[to], input.order);
                    self.success(input.spam, input.order);

                    break;
                default:
                    break;
            }

        } catch (error) {

        }
    });
});