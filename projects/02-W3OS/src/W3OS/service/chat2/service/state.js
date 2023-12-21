//this is the statistics module.

const data={
    alive:0,        //online accounts
    notice:0,       //total notice amount
    message:0,      //total message amount
    group:0,        //group amount on server
}

module.exports = {
    count:(n)=>{
        const inc=!n?1:n;
        data.message=data.message+inc;
    },
    toast:(n)=>{
        const inc=!n?1:n;
        data.notice=data.notice+inc;
    },
    online:()=>{
        data.alive=data.alive+1;
    },
    offline:()=>{
        if(data.alive>0) data.alive=data.alive-1;
    },
    status:()=>{
        return JSON.parse(JSON.stringify(data));
    },
}