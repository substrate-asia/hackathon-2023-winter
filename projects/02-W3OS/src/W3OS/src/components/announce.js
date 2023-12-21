import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import DEVICE from "../lib/device";
import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";
import IMGC from "../open/IMGC";

function Announce(props) {
  const size ={
    row:[12],
  }
  const group = props.id;
  let [hidden, setHidden] = useState(true);
  let [info, setInfo] = useState("");

  const self = {
    click: (ev) => {
      console.log("Announce clicked.");
      const UI=RUNTIME.getUI();
      UI.dialog.show(
        "Annoucement details here",
        "Group Announcement",
        true,     //shown on the center
      );
    },
  };

  const dv=DEVICE.getDevice("screen");

  useEffect(() => {
    RUNTIME.getAccount((acc) => {
      IMGC.local.view(acc.address, group, (res) => {
        //console.log(res);
        if(res && res.more && res.more.announce && res.more.announce.content){
          if(tools.stamp()<res.more.announce.expired){
            setInfo(res.more.announce.content);
            setHidden(false);
          }
        }
      });
    });
  }, []);

  return (
    <Row hidden={hidden} className="pt-2 pb-2 fixAnnounce" style={{background:"#fae9e9",width:`${dv[0]}px`}} onClick={(ev)=>{
      self.click();
    }}>
      <Col className="text-secondary" xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
        lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          {info}
      </Col>
    </Row>
  );
}
export default Announce;
