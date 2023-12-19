import { Container, Row, Col, Navbar,Toast,ToastContainer } from "react-bootstrap";

import { useState, useEffect } from "react";
import TalkingSingle from "../components/talking_single";
import TalkingGroup from "../components/talking_group";
import GroupAdd from "../components/group_add";
import Paybill from "../components/paybill";
import TalkingServer from "../components/talking_server";

import RUNTIME from "../lib/runtime";
import CHAT from "../lib/chat";
import SCROLLER from "../lib/scroll";
import tools from "../lib/tools";

import IMGC from "../open/IMGC";
//import Vertify from "../components/vertify";

import { RiSecurePaymentFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";

let active = "";
function Talking(props) {
  const size = {
    header: [3, 6, 3],
    row: [12],
  };
  let [animation, setAnimation] = useState("ani_scale_in");
  let [framework, setFramework] = useState("");
  let [count, setCount]=useState(0);
  let [title, setTitle] = useState("Talking");
  let [hidden, setHidden] = useState(false);
  let [toast, setToast]=useState("");

  //base on action to create notice recorder
  const decoder = {
    group_create: (mine, obj) => {
      CHAT.save(mine, obj.msg.id, "New group created, enjoy talking", "notice", obj.msg.id, false, () => { });
    },
    group_detail: (mine, obj) => {
      const msg=obj.msg;
      const ctx=`${msg.group.length} members, group details updated.`;
      CHAT.save(mine, msg.id, ctx, "notice", msg.id, false, () => { });
    },
    group_divert:(mine,obj)=>{
      console.log(obj);
      const msg=obj.msg;
      CHAT.save(mine, msg.id, `Group manager is ${tools.shorten(msg.manager)} now`, "notice", msg.id, false, () => { });
    },
    group_update:(mine,obj)=>{

    },
    group_leave: (mine, obj)=>{
      CHAT.save(mine, obj.msg.group, "Leave this group.", "notice", obj.msg.group, false, () => { });
      //TODO, here to trigger fresh the page to list
    },
    group_destory: (mine,obj)=>{
      console.log(mine);
      console.log(obj);
      //CHAT.save(mine, obj.msg.group, "Leave this group.", "notice", obj.msg.group, false, () => { });

      //TODO, here to trigger fresh the page to list
      //TODO, remove the group from localstorage
    },
    vertify_reg:(mine,obj)=>{
      //console.log(obj);
      const msg=obj.msg;
      if(!msg.done){
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
      }else{
        setToast(<ToastContainer position="middle-center" style={{paddingTop:"500px"}}>
        <Toast bg={"info"}>
          <Toast.Body>Already vertified.</Toast.Body>
        </Toast></ToastContainer>);
        setTimeout(()=>{
          setToast("");
        },1500);
      }
    },
    vertify_done:(mine,obj)=>{
      console.log("Vertification done.");
      console.log(obj);
    },
  
  }

  const cmap={
    height:"750px",
  }

  const UI=RUNTIME.getUI();
  const self = {
    page: (ctx, address, header) => {
      active = address;
      //setCount(n);
      setFramework(ctx);    //fresh the content, if changed
      setHidden(true);
      if (header) setTitle(header);
    },
    getPendingGroups:(list)=>{
      const ps=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row.type==="group" && row.group.length<2){
          ps.push(row.id);
        }
      }
      return ps;
    },
    updateGroup:(ps,ck)=>{
      if(ps.length===0) return ck && ck();
      const id=ps.pop();
      IMGC.group.detail(id,(res)=>{
        //console.log("Callback? ");
        //console.log(res);
        self.updateGroup(ps,ck);
      });
    },
    render:(list)=>{
      setFramework(
        <div className="talking_container" style={cmap}>
          {list.map((row, index) => (
            row.type === "group" ?
              <TalkingGroup to={row.id} page={self.page} key={index} details={row} unread={row.un} back={self.back} /> :
              <TalkingSingle to={row.id} page={self.page} key={index} details={row} unread={row.un} back={self.back}/>
          ))}
        </div>
      );
      SCROLLER.allowScroll();
    },
    entry: () => {
      setTitle("Talking");
      RUNTIME.getAccount((fa)=>{
        if(!fa || !fa.address) return console.log(`Not login yet.`);
        RUNTIME.getTalking(fa.address,(list) => {
          const ps=self.getPendingGroups(list);
          if(ps.length!==0){
            self.updateGroup(ps,()=>{

            });
          }else{
            self.render(list);
          }
        });
      });
    },
    newGroup: () => {
      self.page(<GroupAdd back={self.back} />, "group_add", "Select contact");
    },
    payToVertify: (ev) => {
      RUNTIME.getAccount((acc) => {
        IMGC.vertify.reg(acc.address);
      });
    },
    serverSetting:(ev)=>{
      const UI=RUNTIME.getUI();
      UI.dialog.show(<TalkingServer />,"Server Management");
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
      console.log(`Here to get all the messages.`);
      console.log(input);
      
      if (!input || !input.type) return false;

      const un = RUNTIME.exsistMailer(!input.group ? input.from : input.group);
      switch (input.type) {
        case "message":     //message recorder process
          //1.update talking index
          // if (input.group) {
          //   RUNTIME.updateTalkingIndex(input.from, input.group, input.msg, () => {
          //     if (!active) self.entry();
          //   }, !un);
          // } else {
          //   RUNTIME.updateTalkingIndex(input.from, input.to, input.msg, () => {
          //     if (!active) self.entry();
          //   }, !un);
          // }

          RUNTIME.updateTalkingIndex(input.from, !input.group?input.to:input.group, input.msg, () => {
            if (!active) self.entry();
          }, !un,"from");

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
          //console.log(`Write the notice recoder here.`);
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
  }

  useEffect(() => {
    self.entry();
    IMGC.init(self.recorder);
    setTimeout(()=>{
      if(!active) self.entry();
    },2000);
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
        {framework}
      </Container>
      <div className="opts" hidden={hidden}>
        <FaUsers color="grey"  
          onClick={(ev) => {
            self.newGroup(ev);
          }}
        />
        <FaServer color="grey" size={24} style={{marginLeft:"20px"}}
          onClick={(ev) => {
            self.serverSetting(ev);
          }}
        />
        <RiSecurePaymentFill color="grey" style={{marginLeft:"20px"}}
          onClick={(ev) => {
            self.payToVertify(ev);
          }}
        />
      </div>
      {toast}
    </div>
  );
}

export default Talking;