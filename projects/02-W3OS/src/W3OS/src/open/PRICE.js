//document https://docs.coincap.io/

const base="wss://ws.coincap.io/prices?assets=";
const board=["bitcoin","ethereum","kusama","polkadot"];

const PRICE={
  init:(ck)=>{
    const uri=`wss://ws.coincap.io/prices?assets=${board.join(",")}`;
    const wsPrice = new WebSocket(uri)
    wsPrice.onmessage = function (msg) {
        try {
          const map=JSON.parse(msg.data);
          return ck && ck(map);
        } catch (error) {
          return ck && ck(false);
        }
    }
  },
  more:(list,ck)=>{
    const uri=`wss://ws.coincap.io/prices?assets=${list.join(",")}`;
    const wsPrice = new WebSocket(uri)
    wsPrice.onmessage = function (msg) {
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