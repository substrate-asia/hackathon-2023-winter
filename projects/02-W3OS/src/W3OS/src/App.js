import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";

import Navigator from "./components/navigator";
import Grid from "./components/grid";
import Board from "./components/board";

import SystemPassword from "./components/sys_password";

import Dialog from "./layout/dialog";
import Device from "./lib/device";
import RUNTIME from "./lib/runtime";
import SCROLLER from "./lib/scroll";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { RiFingerprintLine } from "react-icons/ri";
import { RiLinkUnlink } from "react-icons/ri";

import IO from "./open/IO";

const size = Device.grids();

function App() {
  let [ctx_stage, setStageContent] = useState("");
  let [ctx_mask, setMaskContent] = useState("");
  let [ctx_page, setPageContent] = useState("");

  let [show, setDialogShow] = useState(false);
  let [content, setContent] = useState("");
  let [title, setTitle] = useState("");
  let [callback, setCallback] = useState(() => {});
  let [center, setCenter] = useState(false);

  let [editing, setEditing] = useState(false);
  let [hidelink, setHidelink] = useState(false);

  let [apps, setApps] = useState([[]]);

  const funs = {
    stage: (ctx) => {
      setStageContent(ctx);
    },
    mask: (ctx) => {
      setMaskContent(ctx);
    },
    page: (ctx) => {
      setPageContent(ctx);
    },
    toast:(ctx)=>{

    },
    dialog:{
      show: (ctx, title, center) => {
        setContent(ctx);
        if (title) setTitle(title);
        setCenter(!center ? false : true);
        setDialogShow(true);
        SCROLLER.allowScroll();
      },
      hide: (ck) => {
        setDialogShow(false);
        return ck && ck();
      },
      agent: (onHide) => {
        setCallback(onHide);
      },
    },
  };
  RUNTIME.setUI(funs);

  let todo = {};
  const self = {
    clickEdit: (ev) => {
      setEditing(!editing);
      if (editing) {
        const list = {};
        for (var pg in todo) {
          if (!list[pg]) list[pg] = [];
          const row = todo[pg];
          for (var ord in row) {
            if (row[ord]) list[pg].push(parseInt(ord));
          }
        }
        //console.log(`Ready to remove apps. ${JSON.stringify(list)}`);
        RUNTIME.removeApp(list, (res) => {
          self.fresh();
        });
      }
    },
    select: (id) => {
      //console.log(`Selected ${id}`);
      const page = 0;
      if (!todo[page]) todo[page] = {};
      todo[page][id] = !todo[page][id];
    },
    login: () => {
      if(RUNTIME.checkPass("")){
        return self.fresh();
      }

      const ctx = RUNTIME.isSalted() ? (
        <p>Please input your password</p>
      ) : (
        <p>
          Please set the W3OS to storage your setting on Localstorage encried by
          AES.<br /> <br />
          Please notes that, if skip this step, all your operation will be lost.{" "}<br />
          The storaged setting will not include your private key.
        </p>
      );
      const title = RUNTIME.isSalted()
        ? "W3OS Login"
        : "W3OS system password setting";
      const todo = RUNTIME.isSalted() ? "Login" : "Set W3OS password";

      const setPass=(ck) => {
        funs.dialog.show(
          <SystemPassword
            button={todo}
            info={ctx}
            callback={(pass) => {
              return ck && ck(pass,self.fresh);
            }}
          />,
          title,
          true,
        );
      };
      RUNTIME.init(setPass, ()=>{
        IO.decoder();     //decode the IO to run proper
        self.fresh();
      });
    },
    fresh: () => {
      RUNTIME.getApps((list) => {
        //console.log(list);
        if (list === false) {
          setTimeout(() => {
            self.login();
          }, 500);
          return false;
        }
        setApps(list);
      });
    },
    linkNetwork: () => {
      RUNTIME.getAPIs((res) => {
        RUNTIME.networkStatus("anchor", (done) => {
          // RUNTIME.getActive((pok)=>{
          //   console.log(pok.rpc.system);
          // });

          if (done) return setHidelink(true);
          setHidelink(false);
        });
      });
    },
    system:(ck)=>{
      const cfg=RUNTIME.getConfig("system");
      RUNTIME.setAvatar(cfg.basic.avatar[0],cfg.basic.theme);
      return ck && ck();
    },
  };

  useEffect(() => {
    self.system(()=>{
      self.login();
      self.linkNetwork();
    });
  }, []);

  return (
    <div>
      <Navigator fresh={self.fresh} />
      <Container>
        <Board />
        <Grid size={size} list={apps}  edit={editing} select={self.select} />
        <Dialog show={show} content={content} callback={callback} title={title} center={center}/>
      </Container>
      {ctx_stage}
      {ctx_mask}
      {ctx_page}
      <div className="opts">
        <IoMdCloseCircleOutline color={editing?"#F3A433":"grey"}  onClick={(ev) => {
            self.clickEdit(ev);
        }}/>
        <RiLinkUnlink color="grey" style={{marginLeft:"10px"}}
          hidden={!RUNTIME.isLogin() || hidelink || editing} 
          onClick={(ev) => {
            self.linkNetwork();
          }}/>
        <RiFingerprintLine color="grey" style={{marginLeft:"10px"}}
          hidden={RUNTIME.isLogin()} 
          onClick={(ev) => {
            self.login();
          }}/>
      </div>
    </div>
  );
}

export default App;
