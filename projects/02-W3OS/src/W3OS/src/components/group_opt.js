import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import GroupJoin from "../components/group_join";
import GroupDivert from "../components/group_divert";
import GroupBlock from "../components/group_block";
import GroupNick from "../components/group_nick";
import GroupDetail from "../components/group_detail";
import GroupAnnouncement from "../components/group_announce";

import { IoIosMore } from "react-icons/io";
import RUNTIME from "../lib/runtime";
//import Mask from "../layout/mask";

import { BiSolidRename } from "react-icons/bi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { GrTrash } from "react-icons/gr";
import { MdJoinLeft } from "react-icons/md";
import { GiDivert } from "react-icons/gi";
import { FaRegCircleStop } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GrCircleInformation } from "react-icons/gr";
import { MdUnfoldMore } from "react-icons/md";

import IMGC from "../open/IMGC";

function GroupOpt(props) {
  const size = {
    row: [12],
    list: [1, 3, 8],
    cell: [3],
    icon: 30,
  };
  const group = props.id;

  let [hidden, setHidden] = useState(true);

  const UI = RUNTIME.getUI();
  const self = {
    click: () => {
      setHidden(!hidden);
    },
    clickNick: (ev) => {
      UI.dialog.show(
        <GroupNick id={group} fresh={props.fresh}/>,
        "Group Name"
      );
    },
    clickAnnounce: (ev) => {
      UI.dialog.show(
        <GroupAnnouncement id={group} fresh={props.fresh}/>,
        "Announcement"
      );
    },
    clickInformation: (ev) => {
      UI.dialog.show(
        <GroupDetail id={group} fresh={props.fresh}/>,
        "Group Information"
      );
    },
    clickAdd: (ev) => {
      UI.dialog.show(
        <GroupJoin back={self.back} id={group} fresh={props.fresh}/>,
        "Members"
      );
    },
    clickDivert: (ev) => {
      UI.dialog.show(
        <GroupDivert back={self.back} id={group} fresh={props.fresh}/>,
        "Set Manager"
      );
    },
    clickBlock: (ev) => {
      UI.dialog.show(
        <GroupBlock back={self.back} id={group} fresh={props.fresh}/>,
        "Set Block Accounts"
      );
    },
    clickLeave: (ev) => {
      RUNTIME.getAccount((fa) => {
        IMGC.group.leave(group, fa.address,(res)=>{
          console.log(`Leaving...`);
          props.fresh();
          setTimeout(()=>{
            props.back();
          },1500);
        });
      })
    },
    clickDestory: (ev) => {
      IMGC.group.destory(group,(res)=>{
        //console.log(res);
        props.fresh();
      });
    },
    clickMore: (ev) => {
      UI.dialog.show(
        "More details of group",
        "More details"
      );
    }
  }

  useEffect(() => {
    setHidden(true);
  }, [props.clean]);

  //#fae9e9

  return (
    <div>
      <div id="mask" hidden={hidden} style={{ opacity: 0 }} onClick={() => {
        setHidden(true);
      }}></div>
      <div className="fixOpts" style={{ zIndex: 1900 }}>
        <Row>
          <Col xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
            lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <button className="btn btn-sm btn-warning" onClick={() => {
              self.click()
            }}><IoIosMore /></button>
          </Col>
          <Col hidden={hidden} className="pt-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]}
            lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row className="pt-2" style={{ background: "#EEFFEE" }}>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickNick(ev);
                  setHidden(true);
                }}>
                <BiSolidRename size={30} />
                <p className="pt-2">Name</p>
              </Col>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickAnnounce(ev);
                  setHidden(true);
                }}>
                <MdOutlineAnnouncement size={30} />
                <p className="pt-2">Announce</p>
              </Col>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickInformation(ev);
                  setHidden(true);
                }}>
                <GrCircleInformation size={30} />
                <p className="pt-2">Information</p>
              </Col>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickLeave(ev);
                  setHidden(true);
                }}>
                <IoMdExit size={30} />
                <p className="pt-2">Leave</p>
              </Col>


              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickAdd(ev);
                  setHidden(true);
                }}>
                <MdJoinLeft size={30} />
                <p className="pt-2">Members</p>
              </Col>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickDivert(ev);
                  setHidden(true);
                }}>
                <GiDivert size={30} />
                <p className="pt-2">Divert</p>
              </Col>
              <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
                lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                  self.clickDestory(ev);
                  setHidden(true);
                }}>
                {/* <IoTrashBinOutline size={30}/> */}
                <GrTrash size={30} />
                <p className="pt-2">Destory</p>
              </Col>
              {/* <Col className="pb-2 pt-2 text-center" xs={size.cell[0]} sm={size.cell[0]} md={size.cell[0]}
              lg={size.cell[0]} xl={size.cell[0]} xxl={size.cell[0]} onClick={(ev) => {
                self.clickBlock(ev);
                setHidden(true);
              }}>
              <FaRegCircleStop size={30}/>
              <p className="pt-2">Block</p>
            </Col> */}

            </Row>
          </Col>
        </Row>

      </div>
    </div>
  );
}
export default GroupOpt;
