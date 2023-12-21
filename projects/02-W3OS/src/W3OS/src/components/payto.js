import { Container, Row, Col } from "react-bootstrap";

import { useState, useEffect } from "react";

import Paybill from "./paybill";
import RUNTIME from "../lib/runtime";

function Payto(props) {
  const size = {
    row: [12],
    head: [4, 4, 4],
    detail: [5, 7],
  };

  const amount = props.amount;
  const target = props.target;

  let [info, setInfo] = useState("");

  const desc = `Pay ${amount} coins to verify the account is valid.`;

  const UI=RUNTIME.getUI();
  const self = {
    click: (ev) => {
      UI.dialog.hide();
      setTimeout(() => {
        RUNTIME.getAccount((acc) => {
          const from = acc.address;
          UI.dialog.show(
            <Paybill
              callback={(res) => {
                console.log(res);
              }}
              desc={desc}
              from={from}
              target={target}
              amount={amount}
            />,
            "Payment Vertification",
          );
        });
      }, 300);
    },
  };

  useEffect(() => {}, []);

  return (
    <Container>
      <Row>
        <Col
          className="pt-2 pb-2"
          xs={size.detail[0]}
          sm={size.detail[0]}
          md={size.detail[0]}
          lg={size.detail[0]}
          xl={size.detail[0]}
          xxl={size.detail[0]}
        >
          <h2>{amount}</h2>
        </Col>
        <Col
          className="pt-2 pb-2"
          xs={size.detail[1]}
          sm={size.detail[1]}
          md={size.detail[1]}
          lg={size.detail[1]}
          xl={size.detail[1]}
          xxl={size.detail[1]}
        >
          <textarea
            className="form-control"
            cols="30"
            rows="4"
            disabled={true}
            defaultValue={target}
          ></textarea>
        </Col>
        <Col
          className="pt-2 pb-2"
          xs={size.detail[1]}
          sm={size.detail[1]}
          md={size.detail[1]}
          lg={size.detail[1]}
          xl={size.detail[1]}
          xxl={size.detail[1]}
        >
          {info}
        </Col>
        <Col
          className="pt-2 pb-2 text-end"
          xs={size.detail[0]}
          sm={size.detail[0]}
          md={size.detail[0]}
          lg={size.detail[0]}
          xl={size.detail[0]}
          xxl={size.detail[0]}
        >
          <button
            className="btn btn-md btn-primary"
            onClick={(ev) => {
              self.click(ev);
            }}
          >
            Pay to vertify
          </button>
        </Col>
      </Row>
    </Container>
  );
}
export default Payto;
