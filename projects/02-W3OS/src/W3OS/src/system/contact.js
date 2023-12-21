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

let selected = { contact: null, stranger: null };

let websocket = null;
let spam = "";
//let chats = {};       //mailer, need to add to RUNTIME
let active = false; //account reg to server status
let friend = false;
let fresh_contact = 0;
let fresh_stranger = 0;
let checker = null;

function Contact(props) {
  const size = {
    header: [3, 6, 3],
    row: [12],
  };

  let [editing, setEditing] = useState(false);
  let [count, setCount] = useState(0);
  let [stranger, setStranger] = useState(0);
  let [hidelink, setHidelink] = useState(false);
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
    send: (obj) => {
      //console.log(websocket.readyState,spam)
      if (!spam || websocket === null || websocket.readyState !== 1)
        return setTimeout(() => {
          self.send(obj);
        }, 500);
      obj.spam = spam;
      websocket.send(JSON.stringify(obj));
    },
    linkChatting: (ev) => {
      if (checker !== null) {
        clearInterval(checker);
        checker = null;
      }
      if (websocket !== null) websocket = null;

      RUNTIME.getSetting((cfg) => {
        const config = cfg.apps.contact,
          uri = config.node[0];
        const agent = {
          open: (res) => {},
          message: (res) => {
            const str = res.data;
            try {
              const input = JSON.parse(str);
              const postman = RUNTIME.getMailer(input.from);
              console.log(input);
              switch (input.act) {
                case "init": //websocket init, use is not active yet.
                  spam = input.spam;
                  RUNTIME.setSpam(uri, input.spam);
                  break;

                case "history":
                  RUNTIME.getAccount((acc) => {
                    CHAT.save(
                      acc.address,
                      input.from,
                      input.msg,
                      "from",
                      (res) => {
                        self.fresh();
                        if (res !== true) {
                          RUNTIME.addContact(res, () => {}, true);
                        }
                      },
                    );
                  });
                  break;

                case "chat":
                  if (postman) postman(input);
                  RUNTIME.getAccount((acc) => {
                    CHAT.save(
                      acc.address,
                      input.from,
                      input.msg,
                      "from",
                      (res) => {
                        self.fresh();
                        if (res !== true) {
                          RUNTIME.addContact(res, () => {}, true);
                        }
                      },
                    );
                  });
                  break;
                case "reg":
                  break;
                case "active":
                  if (input.success) {
                    active = true;
                    setHidelink(true);
                    self.fresh();
                  }
                  break;
                case "notice":
                  if (postman) postman(input);
                  break;
                default:
                  break;
              }
            } catch (error) {}
          },
          close: (res) => {
            websocket = null; //remove websocket link
            active = false;
          },
          error: (res) => {
            console.log(res);
          },
        };

        RUNTIME.getAccount((acc) => {
          if (acc === null || !acc.address) {
            setHidelink(true);
            return false;
          }
          RUNTIME.websocket(
            uri,
            (ws) => {
              websocket = ws;
              setHidelink(true);
              checker = setInterval(() => {
                const status = RUNTIME.wsCheck(uri);
                //console.log(`Websocket status:${status}, checker: ${checker}`);
                if (status === 3) {
                  setHidelink(false);
                  RUNTIME.wsRemove(uri);
                  setTimeout(() => {
                    self.linkChatting(ev);
                  }, 1000);
                }
              }, 5000);

              const data = {
                act: "active",
                acc: acc.address,
              };
              self.send(data);
            },
            agent,
          );
        });
      });
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

  if (!friend) {
    RUNTIME.getContact((fs) => {
      CHAT.friends(fs);
      friend = true;
    });
  }

  useEffect(() => {
    // if (!active) {
    //   self.linkChatting();
    // }

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
        <ContactList
          fresh={self.fresh}
          select={self.select}
          edit={editing}
          count={count}
        />
        <StrangerList
          fresh={self.fresh}
          select={self.select}
          edit={editing}
          count={stranger}
        />
      </Container>
      <div className="opts">
        <IoMdCloseCircleOutline color={editing?"#F3A433":"grey"} onClick={(ev) => {
            self.clickEdit(ev);
        }}/>
        {/* <img
          src="icons/setting.svg"
          hidden={editing}
          className="opt_button"
          alt=""
          onClick={(ev) => {
            self.clickSetting(ev);
          }}
        /> */}
        {/* <img
          src="icons/link.svg"
          hidden={hidelink || active || editing}
          className="opt_button"
          alt=""
          onClick={(ev) => {
            self.linkChatting(ev);
          }}
        /> */}
      </div>
    </div>
  );
}
export default Contact;
