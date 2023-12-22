import { Navbar, Container, Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import PRICE from "../open/PRICE";
import RUNTIME from "../lib/runtime";

const list = {
  "bitcoin": {
    "price": 0,
    "update": 0,
  },
  "ethereum": {
    "price": 0,
    "update": 0,
  },
  "polkadot": {
    "price": 0,
    "update": 0,
  },
  "kusama": {
    "price": 0,
    "update": 0,
  },
  // "bnb":{
  //   "price":0,
  //   "update": 0,
  // },
  "solana":{
    "price":0,
    "update": 0,
  },
}

function Trend(props) {
  const size = {
    header: [3, 6, 3],
    row: [12],
    list: [7, 5]
  };
  const clist = Object.keys(list);
  let [animation, setAnimation] = useState("ani_scale_in");
  let [coins, setCoins] = useState(clist);

  const base = "coins/";
  const self = {
    render: (prices) => {

    }
  };

  useEffect(() => {
    PRICE.more(clist, (map) => {
      for (var k in map) {
        if (list[k]) list[k].price = map[k];
      }
      setCoins(JSON.parse(JSON.stringify(clist)));
    });
  }, []);

  return (
    <div id="page" className={animation}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col xs={size.header[0]} sm={size.header[0]} md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]}
              style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">W<span className="logo">3</span>OS</Navbar.Brand>
            </Col>
            <Col xs={size.header[1]} sm={size.header[1]} md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]}
              style={{ paddingTop: "10px" }}
              className="text-center"
            >
              Trends
            </Col>
            <Col className="text-end pb-2" xs={size.header[2]} sm={size.header[2]} md={size.header[2]}
              lg={size.header[2]} xl={size.header[2]} xxl={size.header[2]}
              style={{ paddingTop: "10px" }}
            >
              <span
                className="close"
                onClick={(ev) => {
                  setAnimation("ani_scale_out");
                  setTimeout(() => {
                    const UI = RUNTIME.getUI();
                    UI.page("");
                  }, 300);
                }}
              >
                <button className="btn btn-sm btn-default">X</button>
              </span>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container>
        {coins.map((row, index) => (
          <Row key={index} className="pt-2 pb-2">
            <Col xs={size.list[0]} sm={size.list[0]} md={size.list[0]}
              lg={size.list[0]} xl={size.list[0]} xxl={size.list[0]}>
              <Image
                src={`${base}${row}.png`}
                rounded
                width="48"
                style={{ minHeight: "48px" }}
              />
              <span style={{marginLeft:"10px"}}>{row}</span>
            </Col>
            <Col className="text-end" xs={size.list[1]} sm={size.list[1]} md={size.list[1]}
              lg={size.list[1]} xl={size.list[1]} xxl={size.list[1]}>
              <span>{list[row].price}</span>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
}
export default Trend;
