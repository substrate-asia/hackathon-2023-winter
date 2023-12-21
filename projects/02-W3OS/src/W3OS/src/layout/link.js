import { Row, Col, Navbar, Container, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";

const format = {
  category: "link",
  src: "HTTP_LINK",
  desc: "DESCRIPTION_OF_LINK",
};

function Link(props) {
  const anchor = props.anchor;

  const size = {
    head: [3, 6, 3],
    row: [12],
    account: [9, 3],
  };

  let [link, setLink] = useState("");
  let [animation, setAnimation] = useState("ani_scale_in");
  let [account, setAccount] = useState("");
  let [show, setShow] = useState(false);

  const UI=RUNTIME.getUI();

  useEffect(() => {
    const alink = `anchor://${anchor}`;
    console.log(alink);
    RUNTIME.getAPIs((APIs) => {
      APIs.Easy(alink, (res) => {
        if (res.type === "unknow") return setLink("Invalid data");
        setShow(true);
        const data = res.data[`${res.location[0]}_${res.location[1]}`];
        setAccount(tools.shorten(data.signer));
        try {
          const json = JSON.parse(data.raw);
          const src = json.src;
          setLink(
            <iframe
              id="link_container"
              title="link_container"
              src={src}
            ></iframe>,
          );
        } catch (error) {
          setLink("Invalid link format");
        }
      });
    });
  }, []);

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
              Linker Loader
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
          className="text-center pt-2"
          xs={size.row[0]}
          sm={size.row[0]}
          md={size.row[0]}
          lg={size.row[0]}
          xl={size.row[0]}
          xxl={size.row[0]}
        >
          <h4>{link}</h4>
        </Col>
      </Row>
      <Container hidden={!show}>
        <Row className="pt-2">
          <Col
            xs={size.row[0]}
            sm={size.row[0]}
            md={size.row[0]}
            lg={size.row[0]}
            xl={size.row[0]}
            xxl={size.row[0]}
          >
            <Badge>Warning</Badge> Only the link on chain.
          </Col>
          <Col
            xs={size.row[0]}
            sm={size.row[0]}
            md={size.row[0]}
            lg={size.row[0]}
            xl={size.row[0]}
            xxl={size.row[0]}
          >
            Supplied by {account}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Link;
