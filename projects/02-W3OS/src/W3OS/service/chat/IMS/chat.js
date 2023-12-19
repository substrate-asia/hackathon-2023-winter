const { WebSocketServer } = require('ws');
const { output } = require("../lib/output");

const clients = {};
const accountSpam = {}, spamToAccount = {};

const summary = {
    active: 0,
    reg: 0,
    msg: 0,
    depository: 0,
};

const agent = {
    reg: null,
    offline: null,
    active: null,
    leave: null,
    get: null,
    group:null,         //group support
};

const self = {
    send: (obj, spam, order) => {
        if (!clients[spam]) return false;
        if (order !== undefined) obj.order = order;
        clients[spam].websocket.send(JSON.stringify(obj));
    },
    success: (obj, spam, order) => {
        obj.success = true;
        self.send(obj, spam, order);
    },
    failed: (obj, spam, order) => {
        //obj.success = false;
        obj.act = "error";
        self.send(obj, spam, order);
    },
    rand: (m, n) => { return Math.round(Math.random() * (m - n) + n); },
    char: (n, pre) => {
        n = n || 7; pre = pre || '';
        for (let i = 0; i < n; i++)pre += i % 2 ? String.fromCharCode(self.rand(65, 90)) : String.fromCharCode(self.rand(97, 122));
        return pre;
    },
    stamp: () => { return new Date().getTime(); },
    count: (obj) => {
        let n = 0;
        for (let k in obj) n++;
        return n;
    },
};

module.exports = {
    // start the chat server
    init: (port, funs) => {
        for (var k in agent) if (funs[k]) agent[k] = funs[k];

        const wss = new WebSocketServer({ port: port });
        output(`Websocket server start on ${port}.`, "dark", true);
        output(`ws://127.0.0.1:${port}`, "primary", true);
        wss.on('connection', (ws, request, client) => {

            const uid = self.char(12);
            clients[uid] = {
                websocket: ws,
                stamp: self.stamp(),
                status: 1,
                IP: "",
            }

            output(`Client linked, uid: ${uid} at ${new Date(clients[uid].stamp)}`, "success");
            ws.send(JSON.stringify({ "spam": uid, "act": "init" }));

            ws.on('close', (res) => {
                delete clients[uid];
                const acc = spamToAccount[uid];
                delete spamToAccount[uid];
                delete accountSpam[acc];
                summary.active--;
                output(`Client removed, uid: ${uid}`, "error");
            });

            ws.on('error', (err) => {
                output(`Error: ${err}`, "error");
            });

            ws.on('message', (res) => {
                const str = res.toString();
                output(`Request:${str}`)
                if (!str) return output(`Empty request.`, "error")

                try {
                    const input = JSON.parse(str);
                    //const result={act:input.act};
                    switch (input.act) {
                        case "reg":     //reg address to server
                            if (!spamToAccount[input.spam]) {
                                output(`Please active the link first`, "error");
                                return self.failed({ msg: "Please active the link first" }, input.spam, input.order);
                            };
                            const acc = spamToAccount[input.spam];
                            output(`User ${acc} is waiting for registion.`);
                            if (agent.reg) {
                                const spam = input.spam;
                                const order = input.order;
                                agent.reg(acc, (amount, target) => {
                                    self.success({ act: "reg", amount: amount, target: target }, spam, order);
                                });
                            }
                            break;

                        case "active":     //live on the server
                            accountSpam[input.acc] = input.spam;
                            spamToAccount[input.spam] = input.acc;
                            const count = self.count(spamToAccount);
                            self.success({ count: count, act: "active" }, input.spam, input.order);

                            //console.log(`clients: ${JSON.stringify(clients)}`);
                            //console.log(`accountSpam: ${JSON.stringify(accountSpam)}`);
                            //console.log(`spamToAccount: ${JSON.stringify(spamToAccount)}`);

                            summary.active++;
                            self.success({ act: "summary", data: summary }, input.spam, input.order);

                            if (agent.get.message) {
                                const list = agent.get.message(input.acc);
                                for (let i = 0; i < list.length; i++) {
                                    const row = list[i];
                                    self.success({ act: "history", msg: row.content, from: row.from, stamp: row.stamp }, input.spam, input.order);
                                }

                                if (agent.active) {
                                    agent.active(input.acc, list.length);
                                }
                            }
                            break;

                        case "offline":     //leave by user action
                            if (!spamToAccount[input.spam]) {
                                return output(`Unknow spam.`, "error");
                            };
                            const uid = input.spam;
                            delete clients[uid];
                            const address = spamToAccount[uid];
                            delete spamToAccount[uid];
                            delete accountSpam[address];
                            summary.active--;
                            output(`Client offline, uid: ${uid}`, "error");
                            self.success({ act: "offline", msg: "done" }, input.spam, input.order);
                            break;

                        case "chat":
                            summary.msg++;
                            if (!spamToAccount[input.spam]) {

                            };

                            const to = input.to;
                            if (!clients[accountSpam[to]]) {
                                output(`User ${to} is not active`, "error");
                                if (agent.offline) {
                                    const from = spamToAccount[input.spam];
                                    agent.offline(from, to, input.msg);
                                }
                                summary.depository++;
                                return self.failed({ msg: "User is not active." }, input.spam, input.order);
                            }

                            self.send({ act: "chat", msg: input.msg, from: spamToAccount[input.spam] }, accountSpam[to], input.order);
                            self.success({}, input.spam, input.order);
                            break;
                            
                        default:
                            output(`Unknow request: ${JSON.stringify(input)}`, "error");
                            break;
                    }

                } catch (error) {
                    output(`Error: ${error}`, "error");
                }
            });
        });
    },

    // Get the cached message list.
    offline: (address) => {

    },

    // Sent notification to target address
    notification: (address, obj) => {
        const spam = accountSpam[address];
        obj.act = "notice";
        if (obj.status) {
            self.success(obj, spam);
        } else {
            self.failed(obj, spam);
        }
    },

    // Update the friend list
    friend: (owner, list, remove) => {

    },

    // Get the friend list
    contact: (owner) => {

    },
}