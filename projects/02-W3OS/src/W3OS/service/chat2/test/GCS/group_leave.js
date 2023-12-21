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
    test_group_leave:(env,order,ck)=>{
        output(`------------------- [${order}] test_group_leave start -------------------`,"info",true);
        const gid=env.groups[0];
        const detail=env.details[gid];
        
        const creator=detail.manager;
        const from=self.getRandomAccount(detail.group,creator);
        const spam=env.accountToSpam[from];
        output(`Group ID: ${gid}, member: ${from}, spam: ${spam}`);

        const ws=env.spamToWebsocket[spam];
        ws.onmessage=(res)=>{
            output(`${res.data} sent to ${from}`,"primary");
            try {
                const rsp=JSON.parse(res.data);
                if(rsp.type==="notice"){
                    if(rsp.method.act==="leave"){
                        //update the group details
                        const req_update={
                            cat:"group",
                            act:"detail",
                            id:gid,
                            spam:spam,
                        }
                        env.send(req_update,spam);
                    }
                }

                if(rsp.type==="error"){
                    output(`Group ${gid} is not valid now. Need to update group details by other account.`);
                    output(`------------------- [${order}] test_group_leave end ---------------------\n`,"info",true);
                    return ck && ck();
                }
            } catch (error) {
                output(`Error from test_group_leave`,"error",true);
                output(error);
            }
        }
        
        //API request params
        const req={
            cat:"group",
            act:"leave",
            id:gid,
            account:from,
            spam:spam,
        }
        env.send(req,spam);
    }
}