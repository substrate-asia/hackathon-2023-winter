import { Navbar, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import PRICE from "../open/PRICE";
import RUNTIME from "../lib/runtime";

function Trend(props) {
  const size = [3, 6, 3];
  let [animation, setAnimation] = useState("ani_scale_in");

  useEffect(() => {
    PRICE.init();
  }, []);

  return (
    <div id="page" className={animation}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col
              xs={size[0]}
              sm={size[0]}
              md={size[0]}
              lg={size[0]}
              xl={size[0]}
              xxl={size[0]}
              style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">
                W<span className="logo">3</span>OS
              </Navbar.Brand>
            </Col>
            <Col
              xs={size[1]}
              sm={size[1]}
              md={size[1]}
              lg={size[1]}
              xl={size[1]}
              xxl={size[1]}
              style={{ paddingTop: "10px" }}
              className="text-center"
            >
              Trends
            </Col>
            <Col
              xs={size[2]}
              sm={size[2]}
              md={size[2]}
              lg={size[2]}
              xl={size[2]}
              xxl={size[2]}
              className="text-end pb-2"
              style={{ paddingTop: "10px" }}
            >
              <span
                className="close"
                onClick={(ev) => {
                  setAnimation("ani_scale_out");
                  setTimeout(() => {
                    const UI=RUNTIME.getUI();
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
      <Container></Container>
    </div>
  );
}
export default Trend;
