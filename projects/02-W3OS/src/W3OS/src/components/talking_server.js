import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Copy from "../lib/clipboard";
import RUNTIME from "../lib/runtime";

let selected=0;
function TalkingServer(props) {
  const size = {
    add: [9, 3],
    server: [9, 3],
    row: [12],
  };

  let [value, setValue] = useState("");
  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");

  
  const self = {
    changeValue: (ev) => {
      setValue(ev.target.value);
    },
    getServers:()=>{
      const cfg = RUNTIME.getConfig("system");
      return cfg.basic.talking;
    },
    clickAdd:(ev)=>{
      const slist=self.getServers();
      if(slist.includes(value)){
        setInfo("The server is in list.");
        return setTimeout(()=>{
          setInfo("");
        },2000);
      }
      selected=0;
      slist.unshift(value);
      setList(JSON.parse(JSON.stringify(slist)));
    },
    clickRow:(index)=>{
      selected=parseInt(index);
      const slist=self.getServers();
      setList(JSON.parse(JSON.stringify(slist)));
    },
    copy:(addr)=>{
      Copy(addr);
    },
    checkURI:(str)=>{

    },
  }

  useEffect(() => {
    const cfg = RUNTIME.getConfig("system");
    const slist = cfg.basic.talking;
    setList(slist);
  }, []);

  

  return (
    <Row>
      <Col xs={size.add[0]} sm={size.add[0]} md={size.add[0]}
        lg={size.add[0]} xl={size.add[0]} xxl={size.add[0]}>
        <input className="form-control " type="text" placeholder="Talking server..." value={value} onChange={(ev) => {
          self.changeValue(ev);
        }} />
      </Col>
      <Col className="text-end" xs={size.add[1]} sm={size.add[1]} md={size.add[1]}
        lg={size.add[1]} xl={size.add[1]} xxl={size.add[1]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickAdd(ev);
        }}>+</button>
      </Col>
      <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
        lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          {info}
      </Col>
      <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
        lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
        Server List
      </Col>
      <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
        lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <Row className="pt-2 pb-2" key={index}>
            <Col xs={size.server[0]} sm={size.server[0]} md={size.server[0]}
              lg={size.server[0]} xl={size.server[0]} xxl={size.server[0]} onClick={(ev)=>{
                self.clickRow(index);
              }}>
              <input  type="checkbox"
                onChange={(ev) => { }}
                checked={index===selected}
                style={{marginTop:"18px",marginRight:"20px"}}/>
              {row}
            </Col>
            <Col className="text-end" xs={size.server[1]} sm={size.server[1]} md={size.server[1]}
              lg={size.server[1]} xl={size.server[1]} xxl={size.server[1]}>
                <button className="btn btn-sm btn-primary mt-2" onClick={(ev)=>{
                  self.copy(row);
                }} >Copy</button>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );
}
export default TalkingServer;
