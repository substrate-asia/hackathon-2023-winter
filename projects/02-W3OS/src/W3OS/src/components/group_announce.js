import { Row, Col, Image } from "react-bootstrap";
import { useState,useEffect } from "react";
import RUNTIME from "../lib/runtime";
import IMGC from "../open/IMGC";

function GroupAnnouncement(props) {
  const size = {
    row: [12],
    opt: [6,6],
    days:[8,2,2],
    save:[8,4],
  };
  const group=props.id;

  let [info, setInfo] = useState("Error message here.");
  let [day, setDay] = useState(1);
  let [annouce, setAnnouce]=useState("");

  const self = {
    changeContent:(ev)=>{
      setAnnouce(ev.target.value);
    },
    changeDays: (ev) => {
      //if(!ev || !ev.target || !ev.target.value) return setDay(0);
      setDay(parseInt(ev.target.value));
    },
    clickInc:()=>{
      setDay(day+1);
    },
    clickDec:()=>{
      if(day<=1) return false;
      setDay(day-1);
    },
    clickSave:(ev)=>{
      setInfo(`Ready to set annouce of ${group},expired: ${day} days later`);
    },
  };

  useEffect(() => {
    
  }, []);

  return (
    <Row>
      <Col className="pt-2 pb-2 text-end" 
        xs={size.days[2]} sm={size.days[2]} md={size.days[2]} lg={size.days[2]} xl={size.days[2]} xxl={size.days[2]}>
          <button className="btn btn-md btn-primary" onClick={(ev)=>{
            self.clickDec();
          }}>-</button>
      </Col>
      <Col className="pt-2 pb-2" 
        xs={size.days[0]} sm={size.days[0]} md={size.days[0]} lg={size.days[0]} xl={size.days[0]} xxl={size.days[0]}>
        <input disabled={true} type="number" className="form-control" placeholder="Days to expired." value={day} onChange={(ev)=>{
          self.changeDays();
        }}/>
      </Col>
      <Col className="pt-2 pb-2" 
        xs={size.days[1]} sm={size.days[1]} md={size.days[1]} lg={size.days[1]} xl={size.days[1]} xxl={size.days[1]}>
          <button className="btn btn-md btn-primary" onClick={(ev)=>{
            self.clickInc();
          }}>+</button>
      </Col>
      <Col className="pt-2 pb-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <textarea className="form-control" cols="30" rows="10" value={annouce} onChange={(ev)=>{
          self.changeContent(ev);
        }}></textarea>
      </Col>
      <Col className="pt-2 pb-2" xs={size.save[0]} sm={size.save[0]} md={size.save[0]} lg={size.save[0]} xl={size.save[0]} xxl={size.save[0]}>
        {info}
      </Col>
      <Col className="pt-2 pb-2 text-end" xs={size.save[1]} sm={size.save[1]} md={size.save[1]} lg={size.save[1]} xl={size.save[1]} xxl={size.save[1]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickSave(ev);
        }}>Save</button>
      </Col>
    </Row>
  );
}
export default GroupAnnouncement;
