import { Row, Col, Image } from "react-bootstrap";
import RUNTIME from "../lib/runtime";

import ContactDetail from "./contact_detail";

function From(props) {
  
  const size = {
    content: [2, 10],
  };

  const address = props.address;

  const UI=RUNTIME.getUI();
  const self={
    click:()=>{
      UI.dialog.show(
        <ContactDetail address={address}/>,
        "Contact Detail"
      );
    },
  }

  return (
    <Row className="pb-2 chat_row">
      <Col  xs={size.content[0]} sm={size.content[0]} md={size.content[0]} lg={size.content[0]} xl={size.content[0]} xxl={size.content[0]}
        onClick={(ev)=>{
          self.click(ev);
        }}>
        <Image
          className="from_icon"
          src={RUNTIME.getAvatar(address)}
          rounded
          width="100%"
        />
      </Col>
      <Col xs={size.content[1]} sm={size.content[1]} md={size.content[1]} lg={size.content[1]} xl={size.content[0]} xxl={size.content[1]}>
        <p className="from">{props.content}</p>
      </Col>
    </Row>
  );
}
export default From;
