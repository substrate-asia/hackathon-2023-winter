const { ApiPromise, WsProvider } = require('@polkadot/api');

let endpoint = "";
module.exports = {
    endpoint: (uri) => {
        endpoint = uri;
    },
    subcribe: (ck) => {
        const provider = new WsProvider(endpoint);
        ApiPromise.create({ provider: provider }).then((wsAPI) => {
            wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
                const hash = lastHeader.hash.toHex();
                const block = lastHeader.number.toNumber();
                wsAPI.rpc.chain.getBlock(hash).then((dt) => {
                    wsAPI.query.system.events.at(hash, (evs) => {
                        const list = evs.toHuman();
                        if (list.length !== 1) {
                            list.shift();
                            return ck && ck(block, list);
                        }
                    });
                });
            });
        });
    },
    convert: (list) => {
        const result=[];
        for(let i=0;i<list.length;i++){
            const row=list[i];
            if(row.event && 
                row.event.method==="Transfer" &&
                row.event.section==="balances" &&
                row.event.index==='0x0602'){
                    result.push(row.event.data)  
            }
        }  
        return result;
    },
}