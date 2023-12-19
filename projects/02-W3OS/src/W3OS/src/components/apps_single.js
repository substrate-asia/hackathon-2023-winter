import { Container, Row, Col } from "react-bootstrap";

import { useEffect } from "react";
import RUNTIME from "../lib/runtime";

function AppSetting(props) {
  const size = [12, 5];
  useEffect(() => {
    RUNTIME.getSetting((res) => {
      const data = res.apps[props.name];
      window.Jeditor.init(data, {
        container: "#setting_con",
        name: `${props.name} setting`,
        setting: {
          row: {
            left: 3,
            right: 9,
            note: 0,
          },
          headerShow: false,
          addShow: false,
        },
        lock: [["notice"]],
      });
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col
          id="setting_con"
          xs={size[0]}
          sm={size[0]}
          md={size[0]}
          lg={size[0]}
          xl={size[0]}
          xxl={size[0]}
        ></Col>
      </Row>
    </Container>
  );
}
export default AppSetting;
