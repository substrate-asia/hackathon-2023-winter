import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import RUNTIME from "../lib/runtime";
import AppSetting from "./apps_single";

const fmt = {
  name: "",
};

function ConfigApp(props) {
  const size = [10, 2];
  let [obj, setObj] = useState({});

  const UI=RUNTIME.getUI();
  const self = {
    click: (name, ev) => {
      UI.dialog.show(
        <AppSetting name={name} />,
        `${name} setting`,
      );
    },
  };

  useEffect(() => {
    RUNTIME.getSetting((res) => {
      const map = res.apps;
      setObj(map);
    });
  }, []);

  return (
    <Row className="pt-2">
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <h5>Application setting</h5>
      </Col>
      {Object.keys(obj).map((name, index) => (
        <Col
          className="pt-4"
          key={index}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
        >
          <Row
            onClick={(ev) => {
              self.click(name, ev);
            }}
          >
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
              className="text-end"
              xs={size[1]}
              sm={size[1]}
              md={size[1]}
              lg={size[1]}
              xl={size[1]}
              xxl={size[1]}
            >
              {">"}
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
export default ConfigApp;
