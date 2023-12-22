import RUNTIME from "../lib/runtime";
import INDEXED from "../lib/indexed";
import tools from "../lib/tools";

const PRICE={
  init:(ck)=>{
    return false;
    const uri="wss://ws.coincap.io/prices?assets=bitcoin,ethereum,kusama";
    //const uri="wss://ws.coincap.io/prices?assets=ALL";
    const wsPrice = new WebSocket(uri)
    wsPrice.onmessage = function (msg) {
        //console.log(msg)
        try {
          const map=JSON.parse(msg.data);
          return ck && ck(map);
        } catch (error) {
          return ck && ck(false);
        }
    }
  },
}

export default PRICE;