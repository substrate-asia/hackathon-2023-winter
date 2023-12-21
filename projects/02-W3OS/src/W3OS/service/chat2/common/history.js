let map={};

module.exports = {
    message:(from, to, ctx, group) => {
        if(!map[to]) map[to]=[];
        const row={
            from:from,
            to:to,
            content:ctx,
            stamp:new Date().getTime(),
        }
        if(group) row.group=group;
        map[to].push(row)
    },
    notice:(from,to,obj,group)=>{
        if(!map[to]) map[to]=[];
        const row={
            type:"notice",
            from:from,
            to:to,
            content:obj,            //{method:{cat:"",act:""},data:{}}
            stamp:new Date().getTime(),
        }
        if(group) row.group=group;
        map[to].push(row)
    },
    mine:(address)=>{
        if(!map[address]) return [];
        return map[address];
    },
    clean:(address,count)=>{
        if(!map[address]) return false;
        for(let i=0;i<count;i++) map[address].pop();
        return true;
    },
    dump:()=>{
        return map;
    },
    recover:(obj)=>{
        map=JSON.parse(JSON.stringify(obj));
        return true;
    },
}