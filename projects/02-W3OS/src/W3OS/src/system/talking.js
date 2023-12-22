import { Container, Row, Col, Navbar, Toast, ToastContainer } from "react-bootstrap";

import { useState, useEffect } from "react";
import TalkingSingle from "../components/talking_single";
import TalkingGroup from "../components/talking_group";
import GroupAdd from "../components/group_add";
import Paybill from "../components/paybill";
import TalkingServer from "../components/talking_server";
import Chat from "../components/chat";
import Login from "../components/login";

import RUNTIME from "../lib/runtime";
import CHAT from "../lib/chat";
import SCROLLER from "../lib/scroll";
import tools from "../lib/tools";

import IMGC from "../open/IMGC";
//import Vertify from "../components/vertify";

import { RiSecurePaymentFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";
import { RiLinkUnlink } from "react-icons/ri";

let active = "";
function Talking(props) {
  const size = {
    header: [3, 6, 3],
    row: [12],
  };
  let [animation, setAnimation] = useState("ani_scale_in");
  let [framework, setFramework] = useState("");
  let [count, setCount] = useState(0);
  let [title, setTitle] = useState("Talking");
  let [hidden, setHidden] = useState(false);
  let [toast, setToast] = useState("");
  let [hiddenLinking, setHiddenLinking] = useState(false);

  let [reg, setReg] = useState("");

  //base on action to create notice recorder
  const decoder = {
    group_create: (mine, obj) => {
      const gid = obj.msg.id;
      const msg = "New group created, enjoy talking";
      CHAT.save(mine, gid, msg, "notice", obj.msg.id, false, () => { });
      console.log(`[group_create] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    group_detail: (mine, obj) => {
      const msg = obj.msg;
      const ctx = `${msg.group.length} members, group details updated.`;
      CHAT.save(mine, msg.id, ctx, "notice", msg.id, false, () => { });
    },
    group_divert: (mine, obj) => {
      const msg = obj.msg;
      const gid = obj.msg.id;
      CHAT.save(mine, msg.id, `Group manager is ${tools.shorten(msg.manager)} now`, "notice", msg.id, false, () => { });
      console.log(`[group_divert] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    group_update: (mine, obj) => {
      const gid = obj.msg.id;
      //const from=obj.msg.from;
      const msg = `Group ${obj.msg.key} updated.`;
      CHAT.save(mine, gid, msg, "notice", gid, false, () => { });
      console.log(`[group_update] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    group_leave: (mine, obj) => {
      const gid=obj.msg.id;
      CHAT.save(mine, gid, "Leave this group.", "notice", gid, false, () => { });
      console.log(`[group_leave] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    group_members:(mine,obj)=>{
      const gid=obj.msg.id;
      CHAT.save(mine, gid, "Group members changed.", "notice", gid, false, () => { });
      console.log(`[group_members] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    group_destory: (mine, obj) => {
      const gid=obj.msg.id;
      CHAT.save(mine, gid, "Leave this group.", "notice", gid, false, () => { });
      console.log(`[group_destory] Details updated, ready to fresh`);
      self.autoFresh(gid);
    },
    vertify_reg: (mine, obj) => {
      //console.log(obj);
      const msg = obj.msg;
      if (!msg.done) {
        UI.dialog.show(
          <Paybill
            callback={(res) => {
              console.log(res);
            }}
            desc={`Pay the amount ${msg.amount} to vertify your account.`}
            from={mine}
            target={msg.account}
            amount={msg.amount}
          />,
          "Payment Vertification",
        );
      } else {
        setToast(<ToastContainer position="middle-center" style={{ paddingTop: "500px" }}>
          <Toast bg={"info"}>
            <Toast.Body>Already vertified.</Toast.Body>
          </Toast></ToastContainer>);
        setTimeout(() => {
          setToast("");
        }, 1500);
      }
    },
    vertify_done: (mine, obj) => {
      console.log("Vertification done.");
      console.log(obj);
    },

  }

  const cmap = {
    height: `${window.innerHeight - 120}px`,
  }

  const UI = RUNTIME.getUI();
  const self = {
    autoFresh:(gid)=>{
      IMGC.group.detail(gid,() => {
        //console.log(`[group_members] Details updated, ready to fresh`);
        if (!active) {
          self.entry();
        }
      });
    },
    page: (ctx, address, header) => {
      active = address;
      //setCount(n);
      setFramework(ctx);    //fresh the content, if changed
      setHidden(true);
      if (header) setTitle(header);
    },
    getPendingGroups: (list) => {
      const ps = [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        //console.log(row);
        if (row.type === "group" && (!row.group || row.group.length < 2)) {
          ps.push(row.id);
        }
      }
      return ps;
    },
    updateGroup: (ps, ck) => {
      if (ps.length === 0) return ck && ck();
      const id = ps.pop();
      IMGC.group.detail(id, (res) => {
        //console.log("Callback? ");
        //console.log(res);
        self.updateGroup(ps, ck);
      });
    },
    render: (list) => {
      setFramework(
        <div className="talking_container" style={cmap}>
          {list.map((row, index) => (
            row.type === "group" ?
              <TalkingGroup to={row.id} page={self.page} key={index} details={row} unread={row.un} back={self.back} /> :
              <TalkingSingle to={row.id} page={self.page} key={index} details={row} unread={row.un} back={self.back} />
          ))}
        </div>
      );
      SCROLLER.allowScroll();
    },
    entry: () => {
      setTitle("Talking");
      RUNTIME.getAccount((fa) => {
        if (!fa || !fa.address) {
          return setReg(
            <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <Login fresh={self.fresh} />
            </Col>,
          );
        }
        setReg("");
        RUNTIME.getTalking(fa.address, (list) => {
          //console.log(list);
          const ps = self.getPendingGroups(list);
          if (ps.length !== 0) {
            self.updateGroup(ps, () => {

            });
          } else {
            self.render(list);
          }
        });
      });
    },
    newGroup: () => {
      RUNTIME.getContact((res) => {
        console.log(res);
        let count = 0;
        for (let k in res) count++;
        self.page(<GroupAdd back={self.back} amount={count} />, "group_add", "Select contact");
      });
    },
    payToVertify: (ev) => {
      RUNTIME.getAccount((acc) => {
        IMGC.vertify.reg(acc.address);
      });
    },
    serverSetting: (ev) => {
      const UI = RUNTIME.getUI();
      UI.dialog.show(<TalkingServer />, "Server Management");
      //console.log(`Here to select server, or add server`);
      //self.page(<GroupAdd back={self.back} />, "server_select", "Select server");
    },
    back: () => {
      self.entry();
      RUNTIME.clearMailer(active);    //remove the mailer
      active = "";
      setHidden(false);
      setTitle("Talking");
    },
    recorder: (input) => {
      //console.log(`Here to get all the messages.`);
      //console.log(input);

      if (!input || !input.type) return false;

      const un = RUNTIME.exsistMailer(!input.group ? input.from : input.group);
      switch (input.type) {
        case "message":     //message recorder process
          console.log(`Here check message and update index, data:${JSON.stringify(input)}`);
          RUNTIME.updateTalkingIndex(input.from, !input.group ? input.to : input.group, input.msg, () => {
            if (!active) self.entry();
          }, !un, "from");

          //2.add stranger if neccessary
          console.log(`Checking address ${input.to} wether stranger.`);
          if(!input.group){  
            RUNTIME.getContact((tmap)=>{
              if(!tmap[input.from]){
                RUNTIME.addContact(input.from,()=>{

                },true);
              }
            });
          }

          //2.save the message record
          RUNTIME.getAccount((acc) => {
            const mine = acc.address;
            if (input.group) {
              CHAT.save(mine, input.from, input.msg, "from", input.group, un, () => { });
            } else {
              CHAT.save(mine, input.from, input.msg, "from", input.from, un, () => { });
            }
          });
          break;

        case "notice":     //notice recorder process
          console.log(`[Notice] Here check notice and update index, data:${JSON.stringify(input)}`);
          if (input.method) {
            const key = `${input.method.cat}_${input.method.act}`;
            if (decoder[key]) {
              RUNTIME.getAccount((acc) => {
                const mine = acc.address;
                decoder[key](mine, input);
              });
            }
          }
          break;
        case "error":
          //console.log(`Got error here.`);
          //TODO, here to check the system error.
          break;
        default:
          break;
      }
    },
    chatSingle: (addr) => {
      self.page(<Chat address={addr} fixed={true} />, addr, tools.shorten(addr));
    },
    chatGroup: (addr) => {

    },
    fresh: () => {
      self.entry();
      IMGC.init(self.recorder, (res) => {
        setHiddenLinking(true);
        if (props.address) {
          console.log(`Ready to load chat`);
          if (props.address.length === 48) {
            self.chatSingle(props.address);
          } else {
            self.chatGroup(props.address);
          }
        }
      });
      setTimeout(() => {
        if (!active) self.entry();
      }, 2000);
    }
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <div id="page" className={animation} count={count}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Row style={{ width: "100%", margin: "0 auto" }}>
            <Col xs={size.header[0]} sm={size.header[0]} md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]}
              style={{ paddingTop: "6px" }}
            >
              <Navbar.Brand href="#">W<span className="logo">3</span>OS</Navbar.Brand>
            </Col>
            <Col xs={size.header[1]} sm={size.header[1]} md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]}
              style={{ paddingTop: "10px" }}
              className="text-center"
            >
              {title}
            </Col>
            <Col xs={size.header[2]} sm={size.header[2]} md={size.header[2]}
              lg={size.header[2]} xl={size.header[2]} xxl={size.header[2]}
              className="text-end pb-2"
              style={{ paddingTop: "10px" }}
            >
              <span
                className="close"
                onClick={(ev) => {
                  if (!active) {
                    setAnimation("ani_scale_out");
                    setTimeout(() => {
                      UI.page("");
                    }, 300);
                  } else {
                    RUNTIME.clearMailer(active);    //remove the mailer
                    active = "";
                    setHidden(false);
                    self.entry();
                  }
                }}
              >
                <button className="btn btn-sm btn-default">X</button>
              </span>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container>
        {reg}
        {framework}
      </Container>
      <div className="opts" hidden={hidden}>
        <FaUsers color="grey"
          onClick={(ev) => {
            self.newGroup(ev);
          }}
        />
        <FaServer color="grey" size={24} style={{ marginLeft: "20px" }}
          onClick={(ev) => {
            self.serverSetting(ev);
          }}
        />
        <RiSecurePaymentFill color="grey" style={{ marginLeft: "20px" }}
          onClick={(ev) => {
            self.payToVertify(ev);
          }}
        />
        <RiLinkUnlink color="grey" style={{ marginLeft: "20px" }}
          hidden={hiddenLinking}
          onClick={(ev) => {
            self.linkChatting(ev);
          }} />
      </div>
      {toast}
    </div>
  );
}

export default Talking;