import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import RUNTIME from "../lib/runtime";

function Overview(props) {
  const anchor = props.link;
  const size = [2, 10];
  let [owner, setOwner] = useState("");
  let [bytes, setBytes] = useState(0);
  let [stamp, setStamp] = useState(0);
  let [protocol, setProtocol] = useState("");

  useEffect(() => {
    RUNTIME.getAPIs((APIs) => {
      APIs.Easy(anchor, (res) => {
        const target = res.location;
        const data = res.data[`${target[0]}_${target[1]}`];
        const bt =
          typeof data.raw !== "string"
            ? JSON.stringify(data.raw).length
            : data.raw.length;

        console.log(data);
        setOwner(data.owner);
        setBytes(bt);
        setStamp(data.stamp);
        setProtocol(data.protocol);
      });
    });
  }, [anchor]);

  return (
    <Row className="pt-2">
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        Anchor Link: {anchor}
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <hr />
      </Col>
      <Col
        xs={size[0]}
        sm={size[0]}
        md={size[0]}
        lg={size[0]}
        xl={size[0]}
        xxl={size[0]}
      >
        Raw
      </Col>
      <Col
        xs={size[1]}
        sm={size[1]}
        md={size[1]}
        lg={size[1]}
        xl={size[1]}
        xxl={size[1]}
      >
        <p>{bytes.toLocaleString()} Bytes</p>
      </Col>
      <Col
        xs={size[0]}
        sm={size[0]}
        md={size[0]}
        lg={size[0]}
        xl={size[0]}
        xxl={size[0]}
      >
        Protocol
      </Col>
      <Col
        xs={size[1]}
        sm={size[1]}
        md={size[1]}
        lg={size[1]}
        xl={size[1]}
        xxl={size[1]}
      >
        <p>{JSON.stringify(protocol)}</p>
      </Col>
      <Col
        xs={size[0]}
        sm={size[0]}
        md={size[0]}
        lg={size[0]}
        xl={size[0]}
        xxl={size[0]}
      >
        Last
      </Col>
      <Col
        xs={size[1]}
        sm={size[1]}
        md={size[1]}
        lg={size[1]}
        xl={size[1]}
        xxl={size[1]}
      >
        <p>{new Date(stamp).toLocaleString()}</p>
      </Col>
      <Col
        xs={size[0]}
        sm={size[0]}
        md={size[0]}
        lg={size[0]}
        xl={size[0]}
        xxl={size[0]}
      >
        Owner
      </Col>
      <Col
        xs={size[1]}
        sm={size[1]}
        md={size[1]}
        lg={size[1]}
        xl={size[1]}
        xxl={size[1]}
      >
        <p>{tools.shorten(owner, 12)}</p>
      </Col>
    </Row>
  );
}
export default Overview;
