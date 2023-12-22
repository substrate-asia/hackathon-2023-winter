import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Thumb from "./thumb";
import tools from "../lib/tools";

import CESS from "../lib/CESS";

function Page(props) {

  let [info, setInfo] = useState("Loading");
  let [list, setList] = useState([]);
  let [hiddenList, setHiddenList] = useState(true);
  let [hiddenInfo, setHiddenInfo] = useState(false);

  const format={
    hash:"",        //CESS file hash
    expire:0,       //time to expire
    size:0,         //folder size totally
    create:0,       //folder create time
    update:0,       //folder update time
  }

  const self = {

  }

  useEffect(() => {
    //CESS.overview();
    const key="cess_selected";
    const folder=localStorage.getItem(key);
    console.log(folder);
    if(folder===null){
      setInfo("No target folder selected");
    }else{
      setHiddenInfo(true);
      setHiddenList(false);
      const nlist = [
        { hash: tools.char(10), icon: "logo512.png", update: tools.stamp() },
        { hash: tools.char(10), icon: "logo512.png", update: tools.stamp() },
        { hash: tools.char(10), icon: "logo512.png", update: tools.stamp() },
        { hash: tools.char(10), icon: "logo512.png", update: tools.stamp() },
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
      ]
      setList(nlist);
    }
  }, []);

  return (
    <Container>
      <Row hidden={hiddenInfo}>
        <Col className="pt-4 text-center">
          <h4>{info}</h4>
        </Col>
      </Row>
      <Row hidden={hiddenList}>
        {list.map((row, index) => (
          <Thumb key={index} data={row} page={props.page}/>
        ))}
      </Row>
    </Container>
  );
}

export default Page;