const tools = require('../../common/tools');
const {output}= require('../../common/output');

const self={
    getRandomAccount:(accs,skip)=>{
        const acc=accs[tools.rand(0,accs.length-1)];
        if(acc!==skip) return acc;
        return self.getRandomAccount(accs,skip);
    },
}

module.exports={
    test_group_message(env,order,ck){
        output(`------------------- [${order}] test_group_message start -------------------`,"info",true);
        const gid=env.groups[0];
        const detail=env.details[gid];
        const creator=detail.manager;
        const speaker=self.getRandomAccount(detail.group);
        const spam=env.accountToSpam[speaker];
        output(`Group ID: ${gid}, manager: ${creator}, speaker: ${speaker}, spam: ${spam}`);
        
        const ws=env.spamToWebsocket[spam];
        ws.onmessage=(res)=>{
            output(res.data,"primary");
            try {
                const rsp=JSON.parse(res.data);
                console.log(rsp);
                // if(rsp.type==="message"){
                    output(`------------------- [${order}] test_group_message end ---------------------\n`,"info",true);
                    return ck && ck();
                // }
            } catch (error) {
                output(`Error from test_group_message`,"error",true);
                output(error);
            }
        }
        const msg="Hello world";
        const req={
            cat:"group",
            act:"chat",
            to:gid,
            msg:msg,
            spam:spam,
        }
        env.send(req,spam);
        // output(`------------------- [${order}] test_group_message end ---------------------\n`,"info",true);
        // return ck && ck();
    },
    test_sample:(env,order,ck)=>{
        output(`------------------- [${order}] test_sample start -------------------`,"info",true);

        output(`------------------- [${order}] test_sample end ---------------------\n`,"info",true);
        return ck && ck();
    },
}