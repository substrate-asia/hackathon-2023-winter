import { Row, Col } from "react-bootstrap";

function Notice(props) {
  const size = {
    row: [12],
  };
  //console.log(props.content);
  return (
    <Row className="pb-1">
      <Col className="text-center text-secondary" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <span className="notice">{props.content}</span>
      </Col>
    </Row>
  );
}
export default Notice;
