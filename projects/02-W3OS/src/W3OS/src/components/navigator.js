import { Container, Navbar, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import RUNTIME from "../lib/runtime";

function Navigator(props) {
  let [name, setName] = useState("");
  let [map, setMap] = useState({});
  //let [anchor,setAnchor]=useState("");

  const self = {
    onChange: (ev) => {
      setMap({ background: "#FFFFFF" });
      setName(ev.target.value);
    },
    onClick: (ev) => {
      RUNTIME.getAPIs((APIs) => {
        APIs.AnchorJS.search(name, (res) => {
          if (res === false || res.empty) {
            return setMap({ background: "#d7a3a3" });
          }

          const napp = RUNTIME.formatApp();
          const type = self.checkType(res);
          //console.log(type);
          napp.name = res.name;
          napp.short = res.name;
          napp.type = type;
          napp.src = `anchor://${res.name}/${res.block}`;
          const page = 0;
          RUNTIME.installApp(napp, page, (done) => {
            if (done) {
              setName("");
              props.fresh();
            }
          });
        });
      });
    },
    checkType: (data) => {
      let type = "data";
      if (data.protocol && data.protocol.type) type = data.protocol.type;
      try {
        const json = JSON.parse(data.raw);
        if (json && json.category) type = json.category;

        return type;
      } catch (error) {
        return type;
      }
    },
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary pb-4">
      <Container>
        <Navbar.Brand href="#home">
          W<span className="logo">3</span>OS
        </Navbar.Brand>
        <Row>
          <Col lg={9} xs={9} className="pt-2">
            <Form.Control
              size="md"
              type="text"
              placeholder="Anchor name..."
              value={name}
              style={map}
              onChange={(ev) => {
                self.onChange(ev);
              }}
            />
          </Col>
          <Col lg={3} xs={3} className="pt-2 text-end">
            <Button
              variant="default"
              onClick={(ev) => {
                self.onClick(ev);
              }}
            >
              +
            </Button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Navigator;
