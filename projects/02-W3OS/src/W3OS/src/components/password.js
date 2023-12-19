import { Row, Col, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Mnemonic from "./mnem.js";

let password = "";
let confirm = "";

function Password(props) {
  let [mnem, setMnem] = useState("");
  let [border, setBorder] = useState("");
  let [info, setInfo] = useState("");
  const self = {
    changePassword: (ev) => {
      //console.log(`Password:${ev.target.value}`);
      password = ev.target.value;
      self.checking();
    },
    changeConfirm: (ev) => {
      //console.log(`Confirm:${ev.target.value}`);
      confirm = ev.target.value;
      self.checking();
    },
    addAccount: () => {
      setInfo("");
      if (password === "") return setInfo("No password");
      if (password !== confirm) return setInfo("Password is not confirmed");
      props.callback(password);
    },
    checking: () => {
      //console.log(`Password:${password},confirm:${confirm}`);
      if (!password) return false;

      if (password !== confirm) setBorder("border-warning");
      else setBorder("");
    },
  };

  useEffect(() => {
    setMnem(<Mnemonic words={props.mnemonic.split(" ")} />);
  }, []);

  return (
    <Row>
      <Col lg={12} xs={12}>
        {mnem}
      </Col>
      <Col lg={12} xs={12} className="pt-2">
        <div className="card">
          <div className="card-body">
            <h4 className="pt-2">{props.account}</h4>
          </div>
        </div>
      </Col>
      <Col lg={12} xs={12} className="pt-2 pb-4">
        <p>
          <span className="badge bg-danger">Important</span>
          &nbsp;&nbsp;Please record these words, it is the only way to get your
          account back.
        </p>
      </Col>
      <Col lg={12} xs={12} className="pt-4">
        <Form.Control
          size="lg"
          type="password"
          placeholder="Password..."
          onChange={(ev) => {
            self.changePassword(ev);
          }}
        />
      </Col>
      <Col lg={12} xs={12} className="pt-2">
        <Form.Control
          size="lg"
          type="password"
          placeholder="Confirm..."
          onChange={(ev) => {
            self.changeConfirm(ev);
          }}
          className={border}
        />
      </Col>
      <Col lg={7} xs={7} className="pt-2">
        {info}
      </Col>
      <Col lg={5} xs={5} className="pt-2 text-end">
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            self.addAccount();
          }}
        >
          Set password
        </Button>
      </Col>
    </Row>
  );
}
export default Password;
