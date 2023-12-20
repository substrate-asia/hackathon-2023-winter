import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";
import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";

import IMGC from "../open/IMGC";

let gp=null;
function GroupNick(props) {
  const size = {
    row: [12],
    opt: [6,6],
  };
  const group=props.id;

  let [info, setInfo] = useState("");
  let [disable, setDisalbe] = useState(true);
  let [nick, setNick]=useState("");

  //console.log(props);
  const self = {
    change: (ev) => {
      setNick(ev.target.value);
      if(!ev.target.value || ev.target.value===gp.more.nick){
        setDisalbe(true);
      }else{
        setDisalbe(false);
      }
    },
    clickNick:()=>{
      //console.log(`Ready to set group ${group} nickname: ${nick}`);
      RUNTIME.getAccount((fa) => {
        IMGC.group.update(group,"nick",nick,(res)=>{
          if(!res.error){
            IMGC.group.detail(group);   //update group details from server
            const UI=RUNTIME.getUI();
            UI.dialog.hide();
            props.fresh();
          }
        });
      })
    },
  };

  useEffect(() => {
    //console.log(group);
    RUNTIME.getAccount((fa) => {
      IMGC.local.view(fa.address,group,(res)=>{
        gp=res;
        setNick(gp.more.nick);
      });
    })
  }, []);

  return (
    <Row>
      <Col className="pt-2 pb-2 text-secondary" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <input type="text" className="form-control" 
          value={nick} 
          onChange={(ev)=>{
            self.change(ev);
          }}
        />
      </Col>
      <Col xs={size.opt[0]} sm={size.opt[0]} md={size.opt[0]} lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]}>
        {info}
      </Col>
      <Col className="text-end" xs={size.opt[1]} sm={size.opt[1]} md={size.opt[1]} lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]}>
        <button disabled={disable} className="btn btn-md btn-primary" onClick={(ev) => {
          self.clickNick();
        }}>Set Group Name</button>
      </Col>
    </Row>
  );
}
export default GroupNick;
