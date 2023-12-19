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
    test_group_destory(env,order,ck){
        output(`------------------- [${order}] test_group_destory start -------------------`,"info",true);
        const gid=env.groups[0];
        const detail=env.details[gid];
        const manager=detail.manager;
        const spam=env.accountToSpam[manager];
        output(`Group ID: ${gid} ,manager: ${manager}, spam: ${spam}`);
        
        const ws=env.spamToWebsocket[spam];
        ws.onmessage=(res)=>{
            output(res.data,"primary");
            try {
                const rsp=JSON.parse(res.data);
                if(rsp.type==="notice"){
                    //1.check devert resutl
                    if(rsp.method.act==="destory"){
                        env.details[gid]=rsp.msg;

                        //2.update the group details
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
                    delete env.details[gid];
                    output(`Group ${gid} data deleted.`);
                    output(`------------------- [${order}] test_group_destory end ---------------------\n`,"info",true);
                    return ck && ck();
                }
                
            } catch (error) {
                output(`Error from test_group_destory`,"error",true);
                output(error);
            }
        }
    
        const req={
            cat:"group",
            act:"destory",
            id:gid,
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