import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

import STORAGE from "../lib/storage.js";

const Keyring = window.Polkadot.Keyring;

function Sign(props) {
  let [password, setPassword] = useState("");
  let [extend, setExtend] = useState("");
  let [info, setInfo] = useState("");
  let [balance, setBalance] = useState(1234.22);
  let [low, setLow] = useState("");
  let [disable, setDisable] = useState("disabled");

  const acc = STORAGE.getKey("signature");

  const self = {
    changePassword: (ev) => {
      setPassword(ev.target.value);
    },
    checkPassword: () => {
      if (!password) return false;
      const keyring = new Keyring({ type: "sr25519" });
      const pair = keyring.createFromJson(acc);
      //const encry=acc.encoding.content[0];
      try {
        pair.decodePkcs8(password);
        return pair;
      } catch (error) {
        return false;
      }
    },
    vertify: () => {
      const pair = self.checkPassword();
      if (pair === false) {
        setInfo("Error password.");
      } else {
        props.callback(pair, props.anchor, props.extend);
      }
    },
    changeExtend: (ev, dt) => {
      props.extend[dt] = ev.target.value;
    },
  };

  useEffect(() => {
    let exDom = "";
    if (props.extend !== undefined) {
      exDom = Object.keys(props.extend).map((dt, index) => (
        <Row key={index}>
          <Col lg={3} xs={3} className="pt-3">
            {" "}
            {dt}
          </Col>
          <Col lg={9} xs={9} className="pt-2">
            <Form.Control
              size="lg"
              type={dt === "sell" ? "number" : "text"}
              placeholder={"Input " + dt + " value..."}
              onChange={(ev) => {
                self.changeExtend(ev, dt);
              }}
            />
          </Col>
        </Row>
      ));
    }
    setExtend(exDom);

    props.balance(acc.address, (res) => {
      if (res === false) {
        setBalance("unknown");
      } else {
        const amount = parseFloat(res.data.free.toBn() * 0.000000000001);
        const min = 100,
          cost = props.cost;
        setBalance(amount.toLocaleString());

        //1.too low balance, stop writing to chain.
        if (amount < min)
          return setLow(`Less than ${min} unit, can not write to chain`);

        //2.cost too much, stop writing to chain.
        if (Math.floor(cost / amount) > 2)
          return setLow(`Your balance is too low to try.`);

        setDisable("");
        return setLow("");
      }
    });
  }, []);

  const cls = {
    wordWrap: "break-word",
    border: "1px solid #EEEEEE",
    padding: "15px 15px 15px 15px",
    borderRadius: "5px",
    fontSize: "20px",
  };

  return (
    <Row>
      <Col lg={12} xs={12} className="text-muted">
        Cost : <span className="text-dark">{props.cost}</span> unit, balance :{" "}
        <span className="text-dark">{balance}</span> unit
      </Col>
      <Col lg={12} xs={12} className="text-danger">
        {low}
      </Col>
      <Col lg={12} xs={12} className="pt-1">
        <p style={cls} className="text-warning">
          {acc.address}
        </p>
      </Col>

      <Col lg={12} xs={12}>
        {extend}
      </Col>
      <Col lg={12} xs={12} className="pt-2">
        <Form.Control
          size="lg"
          type="password"
          placeholder="Account password..."
          onChange={(ev) => {
            self.changePassword(ev);
          }}
        />
      </Col>
      <Col lg={7} xs={7} className="pt-2">
        {info}
      </Col>
      <Col lg={5} xs={5} className="pt-2 text-end">
        <Button
          size="lg"
          variant="primary"
          onClick={() => {
            self.vertify();
          }}
          className={disable}
        >
          Sign
        </Button>
      </Col>
    </Row>
  );
}

export default Sign;
