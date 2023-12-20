const map={};

let timer=null;

const self={
    auto:()=>{
        if(timer===null){
            console.log(`Ready to recover the history data`);
            timer=setInterval(()=>{
                //console.log(`Autosave chat history.`);
            },2000);
        }
    },
}

module.exports = {
    message:(from, to, ctx) => {
        if(timer===null) self.auto();

        if(!map[to]) map[to]=[];
        map[to].push({
            from:from,
            to:to,
            content:ctx,
            stamp:new Date().getTime(),
        })
    },
    mine:(address)=>{
        if(timer===null) self.auto();

        if(!map[address]) return [];
        return map[address];
    },
    clean:(address,count)=>{
        if(!map[address]) return false;
        for(let i=0;i<count;i++) map[address].pop();
        return true;
    },
}