const {task,error}=require("./std");
const {online,offline,count,toast,status}=require("./state");

const History = require("../common/history");

module.exports = {
    online:(input,from)=>{
        //1.sent the servee
        const todo=task("notice");
        todo.params.method={
            cat:"chat",
            act:"active",
        };
        //params.msg={count:data.alive+1};
        todo.params.msg="Welcome";
        todo.params.to=from;

        //2.check the history;
        const nlist=[todo];
        const list=History.mine(from);
        for(let i=0;i<list.length;i++){
            const row=list[i];
            if(!row.type){
                const mm=task("message");
                mm.params.msg=row.content;
                mm.params.to=row.to;
                mm.params.from=row.from;
                if(row.group){
                    mm.params.group=row.group;
                    mm.params.method.cat="group";
                }else{
                    delete mm.params.group;
                } 
                nlist.push(mm);
            }else{
                const nn=task("notice");
                nn.params.msg=row.content.data;
                nn.params.to=row.to;
                nn.params.from=row.from;
                if(row.group){
                    nn.params.group=row.group;
                    nn.params.method=row.content.method;
                }else{
                    delete nn.params.group;
                } 
                nlist.push(nn);
            }        
        }
        History.clean(from,list.length);

        online();   //set online amount
        toast();    //ince notice amount
        return nlist;
    },
    to:(input,from)=>{
        if(!input.to) return error("INPUT_MISSING_PARAMETERS");
        if(!input.msg) return error("INPUT_MISSING_PARAMETERS");

        //1.format message 
        const todo=task("message");
        todo.params.msg=input.msg;
        todo.params.to=input.to;
        todo.params.from=from;
        delete todo.params.group;

        count();        //inc message account;

        return [todo];
    },

    offline:(input,from)=>{
        const todo=task("notice");
        todo.params.msg="Be off-line.";
        todo.params.to=from;

        offline();   //set online amount
        toast();    //ince notice amount

        return [todo];
    },

    /*****************************************************/
    /**************** addional functions *****************/
    /*****************************************************/

    block:(input,from)=>{
        const todo=task("notice");
        todo.params.msg={count:1};
    },
}