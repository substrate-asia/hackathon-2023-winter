import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

function Upload(props) {
  const data=props.data;

  const self={
    click:(hash)=>{
      console.log(`Ready to get file by hash ( ${hash} ) .`);
    },
  }

  //let [list, setList] = useState([]);


  useEffect(() => {
  }, []);

  return (
    <Container className="fixedUpload">
      <Row className="pt-2 pb-4">
        <Col>
          <input type="file" className="form-control" />
        </Col>
        <Col className="text-end">
          <button className="btn btn-md btn-primary">Upload</button>
        </Col>
      </Row>
    </Container>
  );
}

export default Upload;