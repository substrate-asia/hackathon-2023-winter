import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Chat from "./chat";
import Thumbnail from "./thumbnail";
import tools from "../lib/tools";
import RUNTIME from "../lib/runtime";

function TalkingSingle(props) {
  const size = {
    content: [2, 10],
    title: [7, 5],
    row: 12,
  };
  const to = props.to;
  const details = props.details;

  let [nick,setNick]=useState(tools.shorten(to,8));

  
  const self={
    click:(ev)=>{
      setTimeout(()=>{
        props.page(<Chat address={to} fixed={true}/>,to,tools.shorten(to));
      },300);
    },
    getDate:(stamp)=>{
      const now=tools.stamp();
      const diff=now-stamp
      const min=1000*60;
      const hour=60*min;
      const day=24*hour;
      
      if(diff > day){
        const dt=new Date(stamp);
        return dt.toDateString();
      }else if(diff > hour){
        return `${Math.floor(diff/hour)}h ago`;
      }else if(diff > min){
        return `${Math.floor(diff/min)}m ago`;
      }else{
        return `${Math.floor(diff*0.001)}s ago`;
      }
    },
    getNick:(nick,to)=>{
      if(!nick) return tools.shorten(to,8);
      return nick;
    },
  }

  useEffect(() => {
    RUNTIME.singleContact(to,(res)=>{
      //console.log(res);
      if(res.short) setNick(`${res.short}, ${tools.shorten(to,4)}`);
    });
  }, []);

  return (
    <Row className="pt-2 pb-2" onClick={(ev)=>{
      self.click();
    }}>
      <Col className="text-end" xs={size.content[0]} sm={size.content[0]} md={size.content[0]}
        lg={size.content[0]} xl={size.content[0]} xxl={size.content[0]}>
        <Thumbnail list={[to]} group={false}/>
        <span className="count" style={{marginLeft:"45px"}} hidden={!props.unread}>{!props.unread?0:props.unread}</span>
      </Col>
      <Col xs={size.content[1]} sm={size.content[1]} md={size.content[1]}
        lg={size.content[1]} xl={size.content[1]} xxl={size.content[1]}>
        <Row>
          <Col xs={size.title[0]} sm={size.title[0]} md={size.title[0]}
            lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
            <strong>{nick}</strong>
          </Col>
          <Col className="text-end" xs={size.title[1]} sm={size.title[1]} md={size.title[1]}
            lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
            <small>{self.getDate(details.update)}</small>
          </Col>
          <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
            lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>{details.last}</small>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default TalkingSingle;
