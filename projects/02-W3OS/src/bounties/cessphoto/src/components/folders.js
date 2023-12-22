import { Container,Row,Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import tools from "../lib/tools";

function Folders(props) {

  let [info, setInfo] = useState("Loading");
  let [list, setList] = useState([]);
  let [hiddenList,setHiddenList]= useState(true);
  let [hiddenInfo,setHiddenInfo]= useState(false);

  const format={
    hash:"",        //CESS bucket hash
    name:"",        //Folder name
    expire:0,       //time to expire
    size:0,         //folder size totally
    create:0,       //folder create time
    update:0,       //folder update time
  }

  const self={
    clickFolder:(hash)=>{
      //console.log(`${hash} clicked, save to localstorage`);
      const key="cess_selected";
      localStorage.setItem(key,hash);
      props.page("home");
    },
    click:(hash)=>{
      console.log(`Ready to get file by hash ( ${hash} ) .`);
    },
    clickRemove:(hash)=>{
      console.log(`Ready to remove bucket by hash ( ${hash} ) .`);
      self.entry();
    },
    clickFresh:(hash)=>{
      console.log(`Ready to fresh bucket by hash ( ${hash} ) .`);
      self.entry();
    },
    update:()=>{

    },
    getList:()=>{
      const key="cess_folders";
      const list=localStorage.getItem(key);
      if(list===null){
        localStorage.setItem(key,JSON.stringify([]));
        return [];
      }else{
        return list;
      }
    },
    entry:()=>{
      const nlist=[
        {hash:tools.char(32),icon:"logo512.png",update:tools.stamp()},
        {hash:tools.char(32),icon:"logo512.png",update:tools.stamp()},
        {hash:tools.char(32),icon:"logo512.png",update:tools.stamp()},
        {hash:tools.char(32),icon:"logo512.png",update:tools.stamp()},
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
        //{hash:tools.char(10),icon:"logo512.png",update:tools.stamp()},
      ]
      if(nlist.length===0){
  
      }else{
        setHiddenInfo(true);
        setHiddenList(false);
        setList(nlist);
      }
      
    },
  }

  useEffect(() => {
    self.entry();
  }, []);

  return (
    <Container>
      <Row hidden={hiddenInfo}>
        <Col  className="pt-4 text-center">
          <h4>{info}</h4>
        </Col>
      </Row>
      <Row hidden={hiddenList}>
        {list.map((row, index) => (
          <Row className="pt-2" key={index}>
            <Col xs={12} sm={12} md={12} onClick={(ev)=>{
              self.clickFolder(row.hash);
            }}> 
              {row.hash}
            </Col>
            <Col xs={12} sm={12} md={12} onClick={(ev)=>{
              self.clickFolder(row.hash);
            }}> 
              {"Files count;"}
            </Col>
            <Col xs={12} sm={12} md={12} onClick={(ev)=>{
              self.clickFolder(row.hash);
            }}> 
              {"Expire time:"}
            </Col>
            <Col className="pt-1" xs={6} sm={6} md={6}>
              <button className="btn btn-sm btn-danger" onClick={(ev)=>{
                self.clickRemove(row.hash);
              }}>Remove</button>
            </Col>
            <Col className="pt-1 text-end" xs={6} sm={6} md={6}>
              <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                self.clickFresh(row.hash);
              }}>Fresh</button>
            </Col>
            <Col xs={12} sm={12} md={12}>
              <hr/>
            </Col>
          </Row>
          
        ))}
      </Row>
    </Container>
  );
}

export default Folders;