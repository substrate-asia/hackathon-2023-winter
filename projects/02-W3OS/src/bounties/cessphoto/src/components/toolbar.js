import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { IoIosMore } from "react-icons/io";

function Toolbar(props) {
  let [hidden, setHidden] = useState(true);
  let [hideFile, setHideFile] = useState(true);
  let [hideFolder, setHideFolder] = useState(true);
  let [hidePreview, setHidePreview] = useState(true);

  let [disableUpload, setDisableUpload]= useState(true);
  let [disableCreate, setDisableCreate]= useState(true);
  let [folder, setFolder] = useState("");
  const self = {
    clickMore: () => {
      switch (props.way) {
        case "file":
          setHideFile(!hideFile);
          break;
        case "folder":
          setHideFolder(!hideFolder);
          break;
        case "preview":
          setHidePreview(!hidePreview);
          break;
        default:
          break;
      }
    },
    clickRemove:(ev)=>{
      console.log(`Ready to remove current file`);
      props.page("home");
    },
    clickUpload:(ev)=>{
      console.log(`Ready to upload file`);
      props.page("home","file",true);
    },
    clickCreate:(ev)=>{
      console.log(`Ready to create new folder`);
      props.page("home");
    },
    changeFile:(ev)=>{
      //console.log(ev);
      console.log(`Get file to upload, check it here.`);
      setDisableUpload(false);
    },
    changeFolder:(ev)=>{
      setFolder(ev.target.value);
      if(!ev.target.value){
        setDisableCreate(true);
      }else{
        setDisableCreate(false);
      }
    },
    init:()=>{
      setHideFile(true);
      setHideFolder(true);
      setHidePreview(true);
      setDisableUpload(true);
      setDisableCreate(true);
    },
  }

  useEffect(() => {
    //reset the hidden status
    self.init();

    //check main button
    switch (props.way) {
      case "file":
        setHidden(false);
        break;
      case "folder":
        setHidden(false);
        break;
      case "user":
        setHidden(true);
        break;
      case "preview":
        setHidden(false);
        break;
      default:
        break;
    }
  }, [props.way]);

  return (
    <Container className="fixedToolbar" hidden={hidden}>
      <Row className="pt-2 pb-4">
        <Col xs={2} sm={2} md={2}>
          <button className="btn btn-md btn-warning" onClick={(ev) => {
            self.clickMore(ev)
          }}><IoIosMore /></button>
        </Col>
        <Col hidden={hideFile} xs={10} sm={10} md={10}>
          <Row>
            <Col xs={8} sm={8} md={8} >
              <input type="file" className="form-control" onChange={(ev)=>{
                self.changeFile(ev);
              }}/>
            </Col>
            <Col className="text-end" xs={4} sm={4} md={4}>
              <button className="btn btn-md btn-primary" disabled={disableUpload} 
                onClick={(ev)=>{self.clickUpload(ev)}}>
                  Upload
              </button>
            </Col>
          </Row>
        </Col>

        <Col hidden={hideFolder} xs={10} sm={10} md={10}>
          <Row>
            <Col xs={8} sm={8} md={8} >
              <input type="text" className="form-control" placeholder="Folder name..." 
                value={folder}
                onChange={(ev)=>{
                  self.changeFolder(ev);
                }}
              />
            </Col>
            <Col className="text-end" xs={4} sm={4} md={4}>
              <button className="btn btn-md btn-primary" disabled={disableCreate} 
                onClick={(ev)=>{
                  self.clickCreate(ev);
                }}>
                Create
              </button>
            </Col>
          </Row>
        </Col>

        <Col hidden={hidePreview} xs={10} sm={10} md={10}>
          <Row>
            <Col xs={8} sm={8} md={8} ></Col>
            <Col className="text-end" xs={4} sm={4} md={4}>
              <button className="btn btn-md btn-danger"
                onClick={(ev)=>{self.clickRemove(ev)}}>
                Remove
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Toolbar;