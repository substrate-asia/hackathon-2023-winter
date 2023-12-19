import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import RUNTIME from "../lib/runtime";

function Nodes(props) {
  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");
  let [desc, setDesc] = useState("");
  const size = [1, 11];

  useEffect(() => {
    RUNTIME.getSetting((res) => {
      const basic = res.basic;
      setInfo(`${basic.name}[${basic.version}]`);
      setDesc(basic.desc);
      setList(basic.endpoint);
    });
  }, []);

  return (
    <Row className="pt-2">
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <h5>{info}</h5>
        {desc}
      </Col>
      {list.map((item, index) => (
        <Col key={index} xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Row>
            <Col
              xs={size[0]}
              sm={size[0]}
              md={size[0]}
              lg={size[0]}
              xl={size[0]}
              xxl={size[0]}
            >
              <span>G</span>
            </Col>
            <Col
              xs={size[1]}
              sm={size[1]}
              md={size[1]}
              lg={size[1]}
              xl={size[1]}
              xxl={size[1]}
            >
              {item}
            </Col>
          </Row>
        </Col>
      ))}
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <hr />
      </Col>
    </Row>
  );
}

export default Nodes;
