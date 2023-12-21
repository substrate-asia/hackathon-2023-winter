const self={
    stamp:()=>{
        return new Date().getTime();
    },
    rand:(m,n)=>{return Math.round(Math.random() * (m-n) + n);},
    char:(n,pre)=>{
        n=n||7;pre=pre||'';
        for(let i=0;i<n;i++)pre+=i%2?String.fromCharCode(self.rand(65,90)):String.fromCharCode(self.rand(97,122));
        return pre;
    },
    shorten:(addr,n)=>{
        if (n === undefined) n = 10;
        return addr.substr(0, n) + '...' + addr.substr(addr.length - n, n);
    },
}

module.exports=self;