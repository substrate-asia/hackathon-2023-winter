import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Overview(props) {
  const data = props.data;

  const self = {
    click: (hash) => {
      console.log(`Ready to get file by hash ( ${hash} ) .`);
    },
  }

  //let [list, setList] = useState([]);


  useEffect(() => {
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12} sm={12} md={12}>
          Account Address:
        </Col>
        <Col xs={12} sm={12} md={12}>
          Buckets Amount:
        </Col>
        <Col xs={12} sm={12} md={12}>
          Storage Details:
        </Col>
      </Row>
    </Container>
  );
}

export default Overview;