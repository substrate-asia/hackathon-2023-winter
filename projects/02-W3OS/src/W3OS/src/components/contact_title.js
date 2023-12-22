import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import tools from "../lib/tools";

//import RUNTIME from '../lib/runtime';
import Copy from "../lib/clipboard";
import Payment from "../system/payment";
import RUNTIME from "../lib/runtime";

function ContactTitle(props) {
  const size = [2, 7, 3];
  let [clip, setClip] = useState("Copy");
  let [disable, setDisable] = useState(false);

  const address = props.address;

  const UI=RUNTIME.getUI();
  const self = {
    change: (ev) => {
      //setAddress(ev.target.value);
    },
    click: (acc) => {
      Copy(acc);
      setClip("Done");
      setDisable(true);
      setTimeout(() => {
        setDisable(false);
        setClip("Copy");
      }, 1000);
    },
    toFriend: (address) => {
      console.log(address);
    },
    toPay: (address) => {
      UI.dialog.hide();
      UI.page(
        <Payment amount={0} target={address} history={false} />,
      );
    },
  };

  useEffect(() => {}, []);

  return (
    <Row>
      <Col
        xs={size[0]}
        sm={size[0]}
        md={size[0]}
        lg={size[0]}
        xl={size[0]}
        xxl={size[0]}
      >
        {/* <button className='btn btn-sm btn-primary' style={{marginLeft:"10px"}} onClick={(ev)=>{
        self.toFriend(address);
      }}>+</button> */}
        <button
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "10px" }}
          onClick={(ev) => {
            self.toPay(address);
          }}
        >
          $
        </button>
      </Col>
      <Col
        xs={size[1]}
        sm={size[1]}
        md={size[1]}
        lg={size[1]}
        xl={size[1]}
        xxl={size[1]}
      >
        <h5 className="pt-2">{tools.shorten(address, 6)}</h5>
      </Col>
      <Col
        className="text-end"
        xs={size[2]}
        sm={size[2]}
        md={size[2]}
        lg={size[2]}
        xl={size[2]}
        xxl={size[2]}
      >
        <button
          className="btn btn-sm btn-secondary"
          disabled={disable}
          onClick={(ev) => {
            self.click(address);
          }}
        >
          {clip}
        </button>
      </Col>
    </Row>
  );
}
export default ContactTitle;
