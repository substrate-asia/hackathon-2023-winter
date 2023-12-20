import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import RUNTIME from "../lib/runtime";
import Payto from "./payto";

let websocket = null;
let spam = "";
let ready = false;

function ContactSetting(props) {
  const size = {
    row: [12],
    vertify: [9, 3],
  };

  let [server, setServer] = useState("");
  let [info, setInfo] = useState("");
  let [hidden, setHidden] = useState(false);
  let [detail, setDetail] = useState(
    "Your account is not actived on chat server, please veritify your account first.",
  );

  const self = {
    click: (ev) => {
      RUNTIME.getAccount((acc) => {
        if (acc === null || !acc.address) return false;
        const data = {
          act: "reg",
          acc: acc.address,
        };
        //console.log(data);
        self.send(data);
      });
    },
    send: (obj) => {
      if (!ready || !spam)
        return setTimeout(() => {
          self.send(obj);
        }, 200);
      obj.spam = spam;
      websocket.send(JSON.stringify(obj));
    },
  };

  useEffect(() => {}, []);

  return (
    <Row>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        Server:{server}
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <hr />
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        {detail}
      </Col>
      <Col
        xs={size.vertify[0]}
        sm={size.vertify[0]}
        md={size.vertify[0]}
        lg={size.vertify[0]}
        xl={size.vertify[0]}
        xxl={size.vertify[0]}
      >
        {info}
      </Col>
      <Col
        className="text-end"
        xs={size.vertify[1]}
        sm={size.vertify[1]}
        md={size.vertify[1]}
        lg={size.vertify[1]}
        xl={size.vertify[1]}
        xxl={size.vertify[1]}
      >
        <button
          className="btn btn-md btn-primary"
          hidden={hidden}
          onClick={(ev) => {
            self.click(ev);
          }}
        >
          Reg
        </button>
      </Col>
    </Row>
  );
}
export default ContactSetting;
