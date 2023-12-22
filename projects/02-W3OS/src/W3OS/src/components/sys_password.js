import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import RUNTIME from "../lib/runtime";

function SystemPassword(props) {
  const size = {
    row: [12],
    set: [4, 8],
  };

  let [password, setPassword] = useState("");

  const self = {
    changePassword: (ev) => {
      setPassword(ev.target.value);
    },
    click: (ev) => {
      const UI=RUNTIME.getUI();
      UI.dialog.hide();
      props.callback(password);
    },
  };

  useEffect(() => {}, []);

  return (
    <Row>
      <Col className="pb-4" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        {props.info}
      </Col>
      <Col className="pb-4" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Form.Control
          size="md"
          type="password"
          placeholder="Password..."
          onChange={(ev) => {
            self.changePassword(ev);
          }}
        />
      </Col>
      <Col xs={size.set[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}></Col>
      <Col className="text-end" xs={size.set[1]} sm={size.row[1]} md={size.row[1]} lg={size.row[1]} xl={size.row[1]} xxl={size.row[1]}>
        <button
          className="btn btn-md btn-primary"
          onClick={(ev) => {
            self.click(ev);
          }}
        >
          {props.button}
        </button>
      </Col>
    </Row>
  );
}
export default SystemPassword;
