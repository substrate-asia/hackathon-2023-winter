import { Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Preview(props) {
  const data=props.data;

  const self={
    click:(hash)=>{
      console.log(`Ready to get file by hash ( ${hash} ) .`);
    },
  }
  
  useEffect(() => {
  }, []);

  return (
    <Col className="text-center">
      Here to show the photo preview, need a good one.
    </Col>
  );
}

export default Preview;