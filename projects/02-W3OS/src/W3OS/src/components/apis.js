import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import RUNTIME from "../lib/runtime";

function APIs(props) {
  const size = [5, 7];
  let [obj, setObj] = useState({});

  useEffect(() => {
    RUNTIME.getSetting((res) => {
      const map = res.APIs;
      setObj(map);
    });
  }, []);

  return (
    <Row className="pt-2">
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <h5>Supported APIs</h5>
      </Col>
      {Object.keys(obj).map((name, index) => (
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
              {name}
            </Col>
            <Col
              xs={size[1]}
              sm={size[1]}
              md={size[1]}
              lg={size[1]}
              xl={size[1]}
              xxl={size[1]}
            >
              {obj[name].stable}
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
export default APIs;
