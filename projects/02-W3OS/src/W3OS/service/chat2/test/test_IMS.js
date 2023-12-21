//! Function test of W3OS IMS ( Instance Message Service );

const { WebSocket } = require('ws');

const theme = {
    error: '\x1b[31m%s\x1b[0m',
    success: '\x1b[36m%s\x1b[0m',
    primary: '\x1b[33m%s\x1b[0m',
    dark: '\x1b[90m%s\x1b[0m',
};
const output =(ctx, type, skip) => {
    const stamp = () => { return new Date().toLocaleString(); };
    if (!type || !theme[type]) {
        if (skip) return console.log(ctx);
        console.log(`[${stamp()}] ` + ctx);
    } else {
        if (skip) return console.log(theme[type], ctx);
        console.log(theme[type], `[${stamp()}] ` + ctx);
    }
};
console.clear()
output(`Start to test W3OS IMS ( Instance Message Service ) functions`);

//setting part

const URI="ws://localhost:7788";
const accounts={    //default encry file accounts/SS58.json
    "5FQmGPk7qGBmU3K6kDfMSBiUHBYq5NqXpx93KFEvDvyz5sRJ":{
        "pass":"123456",
    },
    "5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw":{
        "pass":"123456",
    },
    "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty":{
        "pass":"123456",
    },
    "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y":{
        "pass":"123456",
    },
}

//test accounts cache
const active={}         //active websocket links
const ws=new WebSocket(URI);

const test=[

]
