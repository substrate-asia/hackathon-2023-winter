import { Navbar, Container, Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

import Paybill from "./paybill";
import Bill from "./bill";
import Balance from "./balance";
import RUNTIME from "../lib/runtime";

let fresh = 0;

function Friend(props) {
  const size = {
    head: [3, 6, 3],
    row: [12],
    account: [9, 3],
  };

  let [animation, setAnimation] = useState("ani_scale_in");

  const UI=RUNTIME.getUI();
  const self = {};

  useEffect(() => {
    RUNTIME.getAccount((sign) => {});
  }, []);

  const amap = {
    width: "66px",
    height: "66px",
    borderRadius: "20px",
    background: "#EEEEEE",
    marginTop: "20px",
  };

  return (
    <div id="page" className={animation}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col
              xs={size.head[0]}
              sm={size.head[0]}
              md={size.head[0]}
              lg={size.head[0]}
              xl={size.head[0]}
              xxl={size.head[0]}
              style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">
                W<span className="logo">3</span>OS
              </Navbar.Brand>
            </Col>
            <Col
              className="text-center"
              xs={size.head[1]}
              sm={size.head[1]}
              md={size.head[1]}
              lg={size.head[1]}
              xl={size.head[1]}
              xxl={size.head[1]}
              style={{ paddingTop: "10px" }}
            >
              Chat
            </Col>
            <Col
              className="text-end pb-2"
              xs={size.head[2]}
              sm={size.head[2]}
              md={size.head[2]}
              lg={size.head[2]}
              xl={size.head[2]}
              xxl={size.head[2]}
              style={{ paddingTop: "10px" }}
            >
              <span
                className="close"
                onClick={(ev) => {
                  if (props.callback) {
                    props.callback();
                  } else {
                    setAnimation("ani_scale_out");
                    setTimeout(() => {
                      UI.page("");
                    }, 300);
                  }
                }}
              >
                <button className="btn btn-sm btn-default">X</button>
              </span>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container>
        <Row className="pt-2">
          <Col
            xs={size.row[0]}
            sm={size.row[0]}
            md={size.row[0]}
            lg={size.row[0]}
            xl={size.row[0]}
            xxl={size.row[0]}
          ></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Friend;
