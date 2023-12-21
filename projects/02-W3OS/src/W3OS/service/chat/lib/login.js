// verity the token
//1. get a salt from server;
//2. sent the value of `MD5( salt + token + salt )` to server;
//3. server calc the value to compare with the sent one;

// fresh the token
// 1. server encry the new token ( 32 Bytes ) by `MD5 ( account )`, then send to client;
// 2. client decode the AES string to get the token. Then sent a normal vertification request;
// 3. server check the result to confirm the token is freshed.

const CryptoJS = require('crypto-js');

const map={};
const temp={};

const self={
    rand: (m, n) => { return Math.round(Math.random() * (m - n) + n); },
    char: (n, pre) => {
        n = n || 7; pre = pre || '';
        for (let i = 0; i < n; i++)pre += i % 2 ? String.fromCharCode(self.rand(65, 90)) : String.fromCharCode(self.rand(97, 122));
        return pre;
    },
    stamp: () => { return new Date().getTime(); },

    check:(salt,token,val)=>{
        const compare=CryptoJS.MD5(salt+token+salt).toString();
        return val===compare;
    },
};

module.exports= {
    export:(fun,ck)=>{
        fun(map,(res)=>{
            
        });
    },
    import:(fun,ck)=>{

    },
    spam:()=>{

    },
    fresh:(spam)=>{

    },
}