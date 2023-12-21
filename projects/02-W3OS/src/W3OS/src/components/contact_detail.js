import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import RUNTIME from "../lib/runtime";

function ContactDetail(props) {
  const size={
    row:[12],
  }

  const address=props.address;

  const self = {
    change: (ev) => {
      //setAddress(ev.target.value);
    },
  };

  useEffect(() => {
    RUNTIME.singleContact(address,(detail)=>{
      console.log(detail);
    });
  }, []);

  return (
    <Row>
      <Col className="" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Contact Details</small>
      </Col>
    </Row>
  );
}
export default ContactDetail;
