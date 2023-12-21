import { Col } from "react-bootstrap";
import { useState } from "react";

//import Stage from '../layout/stage';
import Page from "../layout/page";
import Link from "../layout/link";
import Device from "../lib/device";
//import Overview from './overview';

import Setting from "../system/setting";
import Account from "../system/account";
import Payment from "../system/payment";
import Contact from "../system/contact";
import Talking from "../system/talking";

import TypeData from "./type_data";
import RUNTIME from "../lib/runtime";


function Cell(props) {
  const size = props.size;
  const row = props.data;
  const data = props.data;
  const onSelect = props.select;

  let [check, setCheck] = useState(false);

  const map = {
    setting: <Setting />,
    account: <Account />,
    payment: <Payment amount={0} target={""} />,
    contact: <Contact />,
    talking: <Talking />,
  };
  const UI=RUNTIME.getUI();
  const self = {
    calcBlock: (index) => {
      const details = Device.details();
      const range = details.range;
      const cellX = index % range[0];
      const cellY = Math.floor(index / range[0]);
      const posX = cellX * details.cell[0];
      const posY = details.gridY + cellY * details.cell[1];
      return {
        position: [posX, posY],
        size: details.cell,
        screen: details.screen,
      };
    },
    getAnchor: (link) => {
      const tmp = link.split("anchor://");
      if (tmp.length === 2) return tmp[1];
      return false;
    },
    clickData: () => {
      UI.dialog.show(
        <TypeData link={data.src} />,
        "Anchor Data Viewer",
        true,
      );
    },
    clickApp: () => {
      const anchor = self.getAnchor(row.src);
      UI.page(<Page anchor={anchor} />);
    },
    clickLink: () => {
      const anchor = self.getAnchor(row.src);
      UI.page(<Link anchor={anchor} />);
    },
    clickBase: () => {
      UI.page(map[data.name]);
    },
    click: () => {
      if (data.base) {
        self.clickBase();
      } else {
        switch (data.type) {
          case "data":
            self.clickData();
            break;
          case "lib":
            self.clickData();
            break;
          case "app":
            self.clickApp();
            break;
          case "link":
            self.clickLink();
            break;
          default:
            self.clickData();
            break;
        }
      }
    },
    select: () => {
      if (row.type === "system") return false;
      setCheck(!check);
      onSelect(props.index);
    },
    tail: (str) => {
      if(!str) return '...';
      if (str.length <= 6) return str;
      return str.substr(0, 4) + "..";
    },
  };

  return (
    <Col className="pt-4 cell" xs={size} sm={size} md={size} lg={size} xl={size} xxl={size}>
      <span hidden={true} className={props.index % 2 ? "status green" : "status red"} ></span>
      <span hidden={true} className="type">
        {!row.type ? "unknow" : row.type}
      </span>
      <img
        src={row.icon}
        alt=""
        onClick={(ev) => {
          props.edit ? self.select() : self.click();
        }}
      />
      <h6 onClick={(ev) => {
          props.edit ? self.select() : self.click();
        }}>
        <span>
          <input
            hidden={props.edit ? (row.type === "system" ? true : false) : true}
            type="checkbox"
            onChange={(ev) => { }}
            checked={check}
            style={{ marginRight: "5px" }}
          />
        </span>
        {props.edit
          ? row.type === "system"
            ? row.short
            : self.tail(row.short)
          : row.short}
      </h6>
    </Col>
  );
}
export default Cell;
