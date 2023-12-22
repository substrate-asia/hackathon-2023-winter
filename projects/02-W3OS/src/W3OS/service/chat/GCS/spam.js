/***********************/
/***********************/

// call to get the salt of target account

// Security
// 1. not related to account. That will cause ddos to target account.
const DB = require("../../lib/mndb.js");
const tools = require("../../lib/tools");
const {output}=require("../../lib/output");

const self = {
    clean:(stamp,ckey,mkey)=>{     //clean the expired spam
        //const queue=DB.list_get(ckey);
        //console.log(queue);

        //1.get the latest spam to confirm clean process;
        const first_spam=DB.list_first(ckey);
        const first=DB.hash_get(mkey,first_spam);
        if(!first) return false;

        if( stamp < first.exp) return true;

        //TODO, need to check the clean process cost time.
        //2.ready to clean the expired spam
        const queue=DB.list_get(ckey);
        const map=DB.hash_all(mkey);
        let count=0;
        for(let i=0;i<queue.length;i++){
            const row=queue[i];
            if( stamp < map[row].exp) break;
            count++;
            delete map[row];
        }
        output(`${count} rows need to be removed`)
        for(let i=0;i<count;i++) queue.shift();
    },
}
module.exports = (method, params, id, config,env) => {
    //TODO, record the request to avoid DDOS
    //1.log the request to avoid DDOS
    const spam = tools.char(8);
    const stamp = tools.stamp();
    const exp = stamp + config.expire.spam;

    const ks=config.keys;
    self.clean(stamp,ks.clean,ks.spam);

    DB.list_push(ks.clean,spam);
    DB.hash_set(ks.spam,spam, {
        start: stamp, 
        exp: exp, 
        more: {
            IP:env.IP,      //store the IP to confirm IP
        }
    });
    
    const res = {       //upper method will post res.data to requestor
        spam: spam,              
        stamp: stamp,
    }
    return res;
};