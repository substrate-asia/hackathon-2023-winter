import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Loading(props) {

  let [info, setInfo] = useState("Loading");
  useEffect(() => {
    if(props.content) setInfo(props.content);
  }, []);

  return (
    <Container>
      <Row>
        <Col className="pt-4 text-center">
          <h4>{info}</h4>
        </Col>
      </Row>
    </Container>
  );
}

export default Loading;