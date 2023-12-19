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
    test_manager_deport(env,order,ck){
        output(`------------------- [${order}] test_manager_deport start -------------------`,"info",true);
        const gid=env.groups[0];
        const detail=env.details[gid];
        const creator=detail.manager;
        const block_account=self.getRandomAccount(env.accounts,creator);
        const spam=env.accountToSpam[creator];
        output(`Group manager: ${creator}, block account: ${block_account}, spam: ${spam}`);
        
        const ws=env.spamToWebsocket[spam];
        ws.onmessage=(res)=>{
            output(res.data,"primary");
            try {
                const rsp=JSON.parse(res.data);
                if(rsp.type==="notice"){
                    //1.check devert resutl
                    if(rsp.method.act==="deport"){
                        //2.update the group details
                        const req_update={
                            cat:"group",
                            act:"detail",
                            id:gid,
                            spam:spam,
                        }
                        env.send(req_update,spam);
                    }

                    if(rsp.method.act==="detail"){
                        env.details[gid]=rsp.msg;
                        output(`Group ${gid} data updated. Data: ${JSON.stringify(env.details[gid])}`);
                        output(`------------------- [${order}] test_manager_deport end ---------------------\n`,"info",true);
                        return ck && ck();
                    }
                }
            } catch (error) {
                output(`Error from test_manager_deport`,"error",true);
                output(error);
            }
        }
    
        const req={
            cat:"group",
            act:"deport",
            id:gid,
            account:block_account,
            spam:spam,
        }
        env.send(req,spam);
    
        
    },
    test_account_not_in_group:(env,order,ck)=>{
        output(`------------------- [${order}] test_account_not_in_group start -------------------`,"info",true);

        output(`------------------- [${order}] test_account_not_in_group end ---------------------\n`,"info",true);
        return ck && ck();
    },
}