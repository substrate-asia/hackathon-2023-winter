import { Navbar, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
//import RUNTIME from '../lib/runtime';

import ContactAdd from "../components/contact_add";
import ContactList from "../components/contact_list";
import StrangerList from "../components/contact_stranger";
import ContactSetting from "../components/contact_setting";
import Login from "../components/login";

import RUNTIME from "../lib/runtime";
import CHAT from "../lib/chat";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { RiLinkUnlink } from "react-icons/ri";

let selected = { contact: null, stranger: null };


let friend = false;
let fresh_contact = 0;
let fresh_stranger = 0;

function Contact(props) {
  const size = {
    header: [3, 6, 3],
    row: [12],
  };

  let [editing, setEditing] = useState(false);
  let [count, setCount] = useState(0);
  let [stranger, setStranger] = useState(0);
  let [animation, setAnimation] = useState("ani_scale_in");
  let [reg, setReg] = useState("");

  const UI=RUNTIME.getUI();
  const self = {
    clickSetting: (ev) => {
      UI.dialog.show(<ContactSetting/>, "Contact setting");
    },
    clickEdit: (ev) => {
      setEditing(!editing);
      if (editing && selected.contact !== null) {
        const list = [];
        for (const address in selected.contact) {
          if (selected.contact[address] === true) {
            list.push(address);
          }
        }

        RUNTIME.removeContact(list, (res) => {
          selected.contact = null;
          self.fresh();
        });
      }

      if (editing && selected.stranger !== null) {
        const list = [];
        for (const address in selected.stranger) {
          if (selected.stranger[address] === true) {
            list.push(address);
          }
        }

        RUNTIME.removeContact(
          list,
          (res) => {
            selected.contact = null;
            self.fresh();
          },
          true,
        );
      }
    },
    fresh: () => {
      //console.log(`Fresh page, new chat,${fresh_contact},${fresh_stranger}`);
      fresh_contact++;
      fresh_stranger++;
      setCount(fresh_contact);
      setStranger(fresh_stranger);
      setReg(false);
    },
    select: (map, cat) => {
      selected[cat] = map;
    },
    checkActive: () => {
      RUNTIME.getSetting((cfg) => {
        const config = cfg.apps.contact,
          uri = config.node[0];
        RUNTIME.websocket(uri, (ws) => {
          console.log(ws);
        });
      });
    },
  };

  // set the friends list;
  if (!friend) {
    RUNTIME.getContact((fs) => {
      CHAT.friends(fs);
      friend = true;
    });
  }

  useEffect(() => {
    RUNTIME.getAccount((acc) => {
      if (acc === null || !acc.address) {
        setReg(
          <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Login fresh={self.fresh} />
          </Col>,
        );
      }
    });
  }, []);

  return (
    <div id="page" className={animation}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col
              xs={size.header[0]}
              sm={size.header[0]}
              md={size.header[0]}
              lg={size.header[0]}
              xl={size.header[0]}
              xxl={size.header[0]}
              style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">
                W<span className="logo">3</span>OS
              </Navbar.Brand>
            </Col>
            <Col
              xs={size.header[1]}
              sm={size.header[1]}
              md={size.header[1]}
              lg={size.header[1]}
              xl={size.header[1]}
              xxl={size.header[1]}
              style={{ paddingTop: "10px" }}
              className="text-center"
            >
              Contacts
            </Col>
            <Col
              xs={size.header[2]}
              sm={size.header[2]}
              md={size.header[2]}
              lg={size.header[2]}
              xl={size.header[2]}
              xxl={size.header[2]}
              className="text-end pb-2"
              style={{ paddingTop: "10px" }}
            >
              <span
                className="close"
                onClick={(ev) => {
                  setAnimation("ani_scale_out");
                  setTimeout(() => {
                    UI.page("");
                  }, 300);
                }}
              >
                <button className="btn btn-sm btn-default">X</button>
              </span>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container>
        <ContactAdd fresh={self.fresh} count={count} />
        {reg}
        <ContactList fresh={self.fresh} select={self.select} edit={editing} count={count} />
        <StrangerList fresh={self.fresh} select={self.select} edit={editing} count={stranger} />
      </Container>
      <div className="opts">
        <IoMdCloseCircleOutline color={editing?"#F3A433":"grey"} onClick={(ev) => {
            self.clickEdit(ev);
        }}/>
        {/* <RiLinkUnlink color="grey" style={{marginLeft:"10px"}}
          hidden={hidelink}
        /> */}
      </div>
    </div>
  );
}
export default Contact;