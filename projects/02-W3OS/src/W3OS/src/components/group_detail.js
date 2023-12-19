import { Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";
import IMGC from "../open/IMGC";

function GroupDetail(props) {
  const size = {
    row: [12],
    opt: [6, 6],
    thumb:[3],
  };
  const group = props.id;

  let [nick, setNick] = useState("");
  let [create, setCreate] = useState("");
  let [list, setList] = useState([]);
  let [founder, setFounder] = useState("");
  let [manager, setManager] = useState("");

  const self = {
    change: (ev) => {

    },
    fresh:(ck)=>{
      IMGC.group.detail(group,(res)=>{
        const UI=RUNTIME.getUI();
        UI.dialog.hide();
        props.fresh();
        return ck && ck();
      });
    },
    render:(address)=>{
      IMGC.local.view(address, group, (res) => {
        const data = res.more;
        if(!data.group){
          return IMGC.group.detail(group,(rs)=>{
            setTimeout(()=>{
              self.render(address);
            },1000)
          })
        }

        setNick(!data.nick ? "no nickname yet" : data.nick);

        const dt = new Date(data.create);
        setCreate(dt.toDateString());

        setList(data.group);
        setFounder(data.founder);
        setManager(data.manager);
      });
    }
  };

  useEffect(() => {
    RUNTIME.getAccount((acc) => {
      self.render(acc.address);
    });
  }, []);

  return (
    <Row>
      <Col className="" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Group {nick}. Created at {create}
      </Col>
      <Col className="pt-4" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h6>Members:</h6>
      </Col>
      <Col className="pt-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

        <Row>
          {list.map((row, index) => (
            <Col key={index} xs={size.thumb[0]} sm={size.thumb[0]} md={size.thumb[0]} lg={size.thumb[0]} xl={size.thumb[0]} xxl={size.thumb[0]}>
              <Image src={RUNTIME.getAvatar(row)} rounded width="100%" />
              {tools.shorten(row,3)}
            </Col>
          ))}
        </Row>
      </Col>

      <Col className="pt-4" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h6>Manager:</h6>
      </Col>
      <Col xs={size.thumb[0]} sm={size.thumb[0]} md={size.thumb[0]} lg={size.thumb[0]} xl={size.thumb[0]} xxl={size.thumb[0]}>
        <Image src={RUNTIME.getAvatar(manager)} rounded width="100%" />
        {tools.shorten(manager,3)}
      </Col>
      <Col className="pt-4" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h6>Founder:</h6>
      </Col>
      <Col xs={size.thumb[0]} sm={size.thumb[0]} md={size.thumb[0]} lg={size.thumb[0]} xl={size.thumb[0]} xxl={size.thumb[0]}>
        <Image src={RUNTIME.getAvatar(founder)} rounded width="100%" />
        {tools.shorten(founder,3)}
      </Col>
      <Col className="pt-4 text-end" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.fresh(ev);
        }}>Fresh</button>
      </Col>
    </Row>
  );
}
export default GroupDetail;
