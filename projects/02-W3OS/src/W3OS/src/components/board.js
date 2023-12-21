import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Trend from "../system/trend";
import PRICE from "../open/PRICE";
import RUNTIME from "../lib/runtime";


function Board(props) {
  const size = [6, 6];

  let [btc, setBTC] = useState(40000);
  let [eth, setETH] = useState(2200);
  let [ksm, setKSM] = useState(0);

  const router={
    bitcoin:setBTC,
    ethereum:setETH,
    kusama:setKSM
  }

  const self = {
    click: (ev) => {
      const UI=RUNTIME.getUI();
      UI.page(<Trend />);
    },
  };
  useEffect(() => {
    PRICE.init((data)=>{
      if(data!==false){
        for(var k in data){
          if(router[k])router[k](data[k]);
        }
      }
    });
  }, []);

  return (
    <div
      className="board"
      onClick={(ev) => {
        self.click(ev);
      }}
    >
      <Row>
        <Col xs={size[0]} sm={size[0]}  md={size[0]} lg={size[0]} xl={size[0]} xxl={size[0]}>
          BTC/USDT <strong>{parseFloat(btc).toLocaleString()}</strong> <br/>
          ETH/USDT <strong>{parseFloat(eth).toLocaleString()}</strong>
        </Col>
        <Col xs={size[1]} sm={size[1]}  md={size[1]} lg={size[1]} xl={size[1]} xxl={size[1]}>
          {/* <FaAnchor/>
          <span className="status green"></span> */}
        </Col>
      </Row>
    </div>
  );
}
export default Board;
