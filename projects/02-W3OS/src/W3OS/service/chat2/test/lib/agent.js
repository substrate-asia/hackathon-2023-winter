const tools = require('../../common/tools');
const {output}= require('../../common/output');

const decoder={
    group:{

    },
    chat:{
        
    }
}

const agent={
    "message":(res)=>{
        output(res.data,"primary");
        try {
            const rsp=JSON.parse(res.data);
            switch (rsp.type) {
                case 'chat':
                    
                    break;
                case 'notice':
                    
                    break;
                default:
                    output(`Error to decode data from server`,"error",true);
                    break;
            }
        } catch (error) {
            //output(`Error from test_group_destory`,"error",true);
            output(error);
        }
    },
    "close":(res)=>{

    },
    "error":(res)=>{

    },
}

module.exports=agent;