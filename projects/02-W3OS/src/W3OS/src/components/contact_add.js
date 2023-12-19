import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

import RUNTIME from "../lib/runtime";

function ContactAdd(props) {
  const size = [10, 2];
  let [address, setAddress] = useState("");
  let [disable, setDisalbe] = useState(true);

  const self = {
    change: (ev) => {
      setAddress(ev.target.value);
    },
    click: (ev) => {
      //console.log(address);
      if (!address) return false;
      RUNTIME.addContact(address, (res) => {
        if (res === true) props.fresh();
        setAddress("");
      });
    },
  };

  useEffect(() => {
    RUNTIME.getAccount((acc) => {
      if (acc && acc.address) setDisalbe(false);
    });
  }, [props.count]);

  return (
    <Row>
      <Col className="pt-2" xs={size[0]} sm={size[0]} md={size[0]} lg={size[0]} xl={size[0]} xxl={size[0]}>
        <Form.Control
          size="md"
          type="text"
          placeholder="Address ..."
          disabled={disable}
          value={address}
          onChange={(ev) => {
            self.change(ev);
          }}
        />
      </Col>
      <Col className="pt-2 text-end" xs={size[1]} sm={size[1]} md={size[1]} lg={size[1]} xl={size[1]} xxl={size[1]}>
        <Button
          variant="default"
          disabled={disable}
          onClick={(ev) => {
            self.click(ev);
          }}
        >
          +
        </Button>
      </Col>
    </Row>
  );
}
export default ContactAdd;
