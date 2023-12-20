import { Row, Col, Navbar, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import RUNTIME from "../lib/runtime";

//dialog page container, hidden default

function Page(props) {
  const alink = props.anchor;
  const size = {
    head: [3, 6, 3],
    row: [12],
    account: [9, 3],
  };

  let [link, setLink] = useState("");
  let [animation, setAnimation] = useState("ani_scale_in");

  const UI=RUNTIME.getUI();
  const basic = "loader.html";

  useEffect(() => {
    setLink(`${basic}#${alink}#`);
  }, []);

  return (
    <div id="page" className={animation}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col xs={size.head[0]} sm={size.head[0]} md={size.head[0]}
              lg={size.head[0]} xl={size.head[0]}  xxl={size.head[0]} style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">
                W<span className="logo">3</span>OS
              </Navbar.Brand>
            </Col>
            <Col className="text-center" xs={size.head[1]} sm={size.head[1]} md={size.head[1]}
              lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} style={{ paddingTop: "10px" }}>
              Application Loader
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
                  setAnimation("ani_scale_out");
                  setTimeout(() => {
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
      <Row>
        <Col
          xs={size.row[0]}
          sm={size.row[0]}
          md={size.row[0]}
          lg={size.row[0]}
          xl={size.row[0]}
          xxl={size.row[0]}
        ></Col>
        <Col
          xs={size.row[0]}
          sm={size.row[0]}
          md={size.row[0]}
          lg={size.row[0]}
          xl={size.row[0]}
          xxl={size.row[0]}
        >
          <iframe
            id="capp_container"
            title="capp_container"
            src={link}
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}
export default Page;
