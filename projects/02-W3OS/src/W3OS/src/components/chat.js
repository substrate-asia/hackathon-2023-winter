import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import From from "./chat_from";
import To from "./chat_to";
import Notice from "./chat_notice";

import RUNTIME from "../lib/runtime";
import CHAT from "../lib/chat";
import SCROLLER from "../lib/scroll";
import DEVICE from "../lib/device";

import IMGC from "../open/IMGC";

let backup = [];

function Chat(props) {
  const size = {
    content: [9, 3],
    row: [12],
  };

  const to = props.address
  let [content, setContent] = useState("");
  let [list, setList] = useState([]);
  let mine = "";

  //console.log(`Chat dialog init: ${JSON.stringify(props)}`)
  const self = {
    isGroup: (address) => {
      if (address.length === 48) return false;
      return true;
    },

    chat: (ev) => {
      if (!content) return false;
      self.append(content);
      CHAT.save(mine, to, content, "to", self.isGroup(to)?to:undefined, false, () => {
        //1.update the talking index
        RUNTIME.updateTalkingIndex(mine, to, content, () => {
          //console.log("Talking index updated.");
        },false,"to");
      });
      if (self.isGroup(to)) {
        IMGC.group.chat(content, to);
      } else {
        IMGC.chat(content, to);
      }
      self.toBottom();
    },
    append: (ctx) => {
      const row = {
        type: "to",
        address: mine,
        content: ctx,
      };
      const now = [];
      for (let i = 0; i < list.length; i++) {
        now.push(list[i]);
      }
      now.push(row);
      setList(now);
      setContent("");
      backup = now;
    },
    onChange: (ev) => {
      if (props.click) props.click();    //trigger the blank clean function
      setContent(ev.target.value);
    },
    showHistory: (list) => {
      const cs = [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        switch (row.way) {
          case "from":
            cs.push({ type: "from", address: to.length !== 48 ? row.from : to, content: row.msg });
            break;
          case "to":
            cs.push({ type: "to", address: mine, content: row.msg });
            break;
          case "notice":
            cs.push({ type: "notice", address: mine, content: row.msg });
            break;  
          default:
            break;
        }
      }
      setList(cs);
      backup = cs;
      SCROLLER.allowScroll();
      self.toBottom();
    },
    getUnread: (list) => {
      const nlist = [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        if (row.status === 3) {
          row.status = 1;
          nlist.push(row);
        }
      }
      return nlist;
    },
    toBottom: () => {
      setTimeout(() => {
        const ele = document.getElementById(`con_${props.address}`);
        if (ele !== null) ele.scrollTop = ele.scrollHeight + 50;
      }, 100);
    },
    entry: (ck) => {
      CHAT.page(mine, to, 20, 1, (his) => {
        self.showHistory(his);
        const nlist = self.getUnread(his);
        if (nlist.length !== 0) {
          CHAT.toread(mine, nlist, (res) => {
            if (props.fresh) props.fresh();
            return ck && ck();
          });
        } else {
          return ck && ck();
        }
      });
    },
    indexUpdate: (acc,id) => {
      //console.log(`Update the localStorage index here. ${to}`);
      RUNTIME.getTalking(acc,(list) => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            list[i].un = 0;
          }
        }
        RUNTIME.setTalking(acc,list);
      });
    },
    live: (res) => {
      switch (res.type) {
        case "message":
          const nlist = [];
          for (let i = 0; i < backup.length; i++) {
            nlist.push(backup[i]);
          }
          if (self.isGroup(to)) {
            nlist.push({
              type: "from",
              address: res.from,
              group: to,
              content: res.msg,
            });
          } else {
            nlist.push({
              type: "from",
              address: res.from,
              content: res.msg,
            });
          }
          setList(nlist);
          backup = nlist;
          break;
        case "error":
          console.log(res);

          break;
        default:
          break;
      }
      self.toBottom();
    },
    format: (row, key) => {
      let dom = "";
      switch (row.type) {
        case "notice":
          dom = (<Notice address={row.address} key={key} content={row.content} />)
          break;
        case "from":
          dom = (<From address={row.address} key={key} content={row.content} />)
          break;
        case "to":
          dom = (<To address={row.address} key={key} content={row.content} />)
          break;
        default:
          break;
      }
      return dom;
    },
  };

  RUNTIME.getAccount((res) => {
    mine = res.address;
  });

  useEffect(() => {
    self.entry(() => {
      self.indexUpdate(mine,to);
    });

    RUNTIME.setMailer(to, (res) => {
      console.log(to);
      console.log(res);
      self.live(res);
    });

    if(self.isGroup(to)){
      IMGC.local.view(mine,to,(gp)=>{
        //console.log(gp);
      });
    }
  }, [props.n]);

  const dv = DEVICE.getDevice("screen");

  return (
    <Row className="pb-2">
      <Col className="chat_container" style={{ height: `${!props.height?(dv[1] - 140):props.height}px` }} id={`con_${props.address}`}
        xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <div id={`scroll_${props.address}`}>
          {list.map((row, key) =>
            self.format(row, key)
          )}
        </div>
      </Col>
      <div className={!props.fixed?"":"fixfooter"}>
        <Row className="pb-2 pt-2">
          <Col xs={size.content[0]} sm={size.content[0]} md={size.content[0]}
            lg={size.content[0]} xl={size.content[0]} xxl={size.content[0]}>
            <input type="text" className="form-control" value={content}
              onChange={(ev) => {
                self.onChange(ev);
              }}
            />
          </Col>
          <Col className="text-end" xs={size.content[1]} sm={size.content[1]} md={size.content[1]} lg={size.content[1]}
            xl={size.content[1]} xxl={size.content[1]}>
            <button className="btn btn-md btn-primary"
              onClick={(ev) => {
                self.chat(ev);
              }}
            >Send</button>
          </Col>
        </Row>
      </div>
    </Row>
  );
}
export default Chat;
