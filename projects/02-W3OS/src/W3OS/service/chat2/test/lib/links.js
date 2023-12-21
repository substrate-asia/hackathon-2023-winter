
const self={
    init:(url,acc,agent,ck)=>{
        const ws=new WebSocket(url);
        ws.onopen=(res)=>{
            agent.open(res,acc);
        };
        ws.onmessage=(res)=>{
            agent.message(res,acc);
        };
        ws.onclose=(res)=>{
            agent.close(res,acc);
        };
        ws.onerror=(res)=>{
            agent.error(res,acc);
        };
        return ck && ck(ws,acc);
    },
    send:(obj,acc)=>{
        // if(!wmap[acc]) return false;
        // if(!count[acc]){
        //     count[acc]=1;
        // }else{
        //     count[acc]++;
        // }
        // const ws=wmap[acc];
        // obj.order=count[acc];
        // ws.send(JSON.stringify(obj));
        // return true;
    },
    // actions:()=>{
    //     $(".single").off("click").on("click",function(){
    //         const sel=$(this);
    //         const acc=sel.attr("data");
    //         const index=sel.attr("index");
    //         $(`#target_${index}`).val(!acc?"":acc);
    //     });
    // },
};


module.exports={
    init:(url,accounts)=>{
        for(var acc in accounts){

        }
    }
}