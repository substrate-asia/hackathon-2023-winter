import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import RUNTIME from "../lib/runtime";
import Talking from "../system/talking";
import Payment from "../system/payment";
import Copy from "../lib/clipboard";

function ContactDetail(props) {
  const size = {
    row: [12],
    table: [3, 9],
    save: [9, 3],
  }

  const address = props.address;

  let [info, setInfo] = useState("");
  let [intro, setIntro] = useState("");
  let [short, setShort] = useState("");
  let [disable, setDisable] = useState(false);
  let [clip, setClip] = useState("Copy");

  const self = {
    changeShort: (ev) => {
      setShort(ev.target.value);
    },
    changeIntro: (ev) => {
      setIntro(ev.target.value);
    },
    clickSave: (ev) => {
      RUNTIME.setContact(address, { intro: intro, short: short }, (res) => {
        const UI = RUNTIME.getUI();
        UI.dialog.hide();
        props.fresh();
      });
    },
    clickChat: (ev) => {
      const UI = RUNTIME.getUI();
      UI.dialog.hide();
      UI.page(
        <Talking address={address} />
      );
    },
    clickPayment: (ev) => {
      const UI = RUNTIME.getUI();
      UI.dialog.hide();
      UI.page(
        <Payment amount={0} target={address} history={false} />,
      );
    },
    clickFriend:(ev)=>{
      RUNTIME.removeContact([address],()=>{
        RUNTIME.addContact(address,()=>{
          const UI = RUNTIME.getUI();
          UI.dialog.hide();
          if(props.fresh) props.fresh();
        })
      },true);
    },
    clickCopy: (addr) => {
      Copy(addr);
      setDisable(true);
      setClip("Done");
      setTimeout(() => {
        setDisable(false);
        setClip("Copy");
      }, 1000);
    },
  };

  useEffect(() => {
    RUNTIME.singleContact(address, (detail) => {
      if(detail.short)setShort(detail.short);
      if(detail.intro)setIntro(detail.intro);
    },!props.strange?false:true);
  }, []);

  const cmap = {
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    fontSize: "14px",
  };

  return (
    <Row>
      <Col hidden={!props.strange?false:true} className="pb-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col className="pb-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Contact Details
          </Col>

          <Col className="pb-2" xs={size.table[0]} sm={size.table[0]} md={size.table[0]} lg={size.table[0]} xl={size.table[0]} xxl={size.table[0]}>
            <small>Name</small>
          </Col>
          <Col className="pb-2" xs={size.table[1]} sm={size.table[1]} md={size.table[1]} lg={size.table[1]} xl={size.table[1]} xxl={size.table[1]}>
            <input className="form-control" type="text" value={short} onChange={(ev) => {
              self.changeShort(ev);
            }} />
          </Col>

          <Col className="pb-2" xs={size.table[0]} sm={size.table[0]} md={size.table[0]} lg={size.table[0]} xl={size.table[0]} xxl={size.table[0]}>
            <small>Description</small>
          </Col>
          <Col className="pb-2" xs={size.table[1]} sm={size.table[1]} md={size.table[1]} lg={size.table[1]} xl={size.table[1]} xxl={size.table[1]}>
            <input className="form-control" type="text" value={intro} onChange={(ev) => {
              self.changeIntro(ev);
            }} />
          </Col>

          <Col className="pb-2 pt-2" xs={size.save[0]} sm={size.save[0]} md={size.save[0]} lg={size.save[0]} xl={size.save[0]} xxl={size.save[0]}>
            {info}
          </Col>
          <Col className="pb-2 pt-2 text-end" xs={size.save[1]} sm={size.save[1]} md={size.save[1]} lg={size.save[1]} xl={size.save[1]} xxl={size.save[1]}>
            <button className="btn btn-md btn-primary" onClick={(ev) => {
              self.clickSave(ev);
            }}>Save</button>
          </Col>
          <Col className="pb-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
        </Row>
      </Col>
      <Col className="pb-2" xs={size.table[0]} sm={size.table[0]} md={size.table[0]} lg={size.table[0]} xl={size.table[0]} xxl={size.table[0]}>
        Functions
      </Col>
      <Col className="pb-2 text-end" xs={size.table[1]} sm={size.table[1]} md={size.table[1]} lg={size.table[1]} xl={size.table[1]} xxl={size.table[1]}>
        <button hidden={props.chatHidden ? true : false} className="btn btn-md btn-primary" onClick={(ev) => {
          self.clickChat(ev);
        }}>Chat</button>
        <button hidden={!props.strange?false:true} className="btn btn-md btn-primary" style={{ "marginLeft": "24px" }} onClick={(ev) => {
          self.clickPayment(ev);
        }}>Pay to</button>
        <button hidden={!props.strange} style={{ "marginLeft": "24px" }} className="btn btn-md btn-primary" onClick={(ev) => {
          self.clickFriend(ev);
        }}>To Friend</button>
      </Col>

      <Col className="pb-2 pt-2" xs={size.save[0]} sm={size.save[0]} md={size.save[0]} lg={size.save[0]} xl={size.save[0]} xxl={size.save[0]}>
        <span style={cmap}>{address}</span>
      </Col>
      <Col className="pb-2 pt-2 text-end" xs={size.save[1]} sm={size.save[1]} md={size.save[1]} lg={size.save[1]} xl={size.save[1]} xxl={size.save[1]}>
        <button className="btn btn-sm btn-primary mt-3" disabled={disable} onClick={(ev) => {
          self.clickCopy(address);
        }}>{clip}</button>
      </Col>
    </Row>
  );
}
export default ContactDetail;
