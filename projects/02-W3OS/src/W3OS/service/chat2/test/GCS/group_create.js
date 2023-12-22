const tools = require('../../common/tools');
const {output}= require('../../common/output');

module.exports={
    test_group_create:(env,order,ck)=>{
        output(`------------------- [${order}] test_group_create start -------------------`,"info",true);
        const creator=env.accounts[tools.rand(0,env.accounts.length-1)];
        const spam=env.accountToSpam[creator];
        output(`Random creator: ${creator}, spam: ${spam}`);
    
        const ws=env.spamToWebsocket[spam];
        ws.onmessage=(res)=>{
            output(`${res.data} sent to ${creator}`,"primary");
            try {
                const rsp=JSON.parse(res.data);
                if(rsp.type==="notice"){
                    if(rsp.method.act==="create"){
                        const gid=rsp.msg.id;
                        env.groups.push(gid);
    
                        const req_2={
                            cat:"group",
                            act:"detail",
                            id:gid,
                            spam:spam,
                        }
                        env.send(req_2,spam);
                    }
    
                    if(rsp.method.act==="detail"){
                        env.details[rsp.msg.id]=rsp.msg;
                        output(`------------------- [${order}] test_group_create end ---------------------\n`,"info",true);
                        return ck && ck();
                    }
                }
            } catch (error) {
                output(`Error from test_group_create`,"error",true);
                output(error);
            }
        }
    
        const req={
            cat:"group",
            act:"create",
            list:[creator],
            spam:spam,
        }
        env.send(req,spam);
    },
    
    test_empty_accounts:(env,order,ck)=>{

    },
}