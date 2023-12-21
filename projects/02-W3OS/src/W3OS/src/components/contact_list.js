import { Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";

import Chat from "./chat";
import ContactTitle from "./contact_title";
import ContactDetail from "./contact_detail";

//import Friend from './friend';
//import Contact from '../system/contact';

import RUNTIME from "../lib/runtime";
import CHAT from "../lib/chat";
import tools from "../lib/tools";

function ContactList(props) {
  const size = [12];
  const dv = { xs: 3, sm: 3, md: 3, lg: 3, xl: 6, xxl: 6 };
  const count = props.count;

  let [contact, setContact] = useState([]);
  let [select, setSelect] = useState({});

  const UI=RUNTIME.getUI();
  const self = {
    click: (address, unread) => {

      UI.dialog.show(
        <Chat address={address} fresh={props.fresh} height={560} fixed={false}/>,
        <ContactTitle address={address} />,
      );
      // check unread to open right dialog
      // if(unread===0){
      //   UI.dialog.show(
      //     <ContactDetail address={address}/>,
      //     `Contact details`//tools.shorten(address,6),
      //   );
      // }else{
      //   UI.dialog.show(
      //     <Chat address={address} fresh={props.fresh} height={600} />,
      //     <ContactTitle address={address} />,
      //   );
      // }
    },
    select: (address) => {
      select[address] = !select[address];
      props.fresh();
      props.select(select, "contact");
    },
    getCount: (mine, list, ck, map, order) => {
      if (!map) map = {};
      if (!order) order = [];
      if (list.length === 0) {
        delete order["0"];
        return ck && ck(map, order);
      }
      const acc = list.pop();
      CHAT.unread(mine, acc, (res) => {
        const n = res.count;
        map[acc] = !n ? 0 : n;
        if (res.latest !== 0) order[res.latest] = acc;
        return self.getCount(mine, list, ck, map, order);
      });
    },
    sortList: (data, map) => {
      if (data.length === 0) return [];
      const raw = {};
      for (let i = 0; i < data.length; i++) {
        raw[data[i].address] = i;
      }

      const target = [];
      for (var k in map) target.push(k);
      const order = target.sort((a, b) => {
        return b - a;
      });

      const arr = [];
      for (let i = 0; i < order.length; i++) {
        const stamp = order[i];
        const address = map[stamp];
        const index = raw[address];
        arr.push(data[index]);
      }
      return arr;
    },
  };

  useEffect(() => {
    RUNTIME.getAccount((fa) => {
      if (fa === null) return false;
      const mine = fa.address;
      RUNTIME.getContact((cs) => {
        const nlist = [];
        for (var k in cs) nlist.push(k);

        self.getCount(mine, nlist, (un, order) => {
          //console.log(order);
          const ulist = [],
            zlist = [];
          for (var k in cs) {
            const atom = cs[k];
            atom.address = k;
            atom.unread = !un[k] ? 0 : un[k];
            !un[k] ? zlist.push(atom) : ulist.push(atom);
          }

          const olist = self.sortList(ulist, order);
          const list = olist.concat(zlist);
          setContact(list);
        });
      });
    });
  }, [count]);

  return (
    <Row index={count}>
      {contact.map((row, index) => (
        <Col xs={dv.xs} sm={dv.sm} md={dv.md} lg={dv.lg} xl={dv.xl} xxl={dv.xxl} key={index}
          onClick={(ev) => {
            props.edit ? self.select(row.address) : self.click(row.address, row.unread);
          }}
        >
          <Row>
            <Col className="pt-2 text-center" xs={size[0]} sm={size[0]} md={size[0]}
              lg={size[0]} xl={size[0]} xxl={size[0]}>
              <Image
                src={RUNTIME.getAvatar(row.address)}
                rounded
                width="100%"
                style={{ minHeight: "80px" }}
              />
              <span className="count" hidden={!row.unread || row.unread === 0}>
                {!row.unread ? 0 : row.unread}
              </span>
              <small>
                <input
                  hidden={!props.edit}
                  type="checkbox"
                  checked={!select[row.address] ? false : select[row.address]}
                  onChange={(ev) => {
                    //self.change(ev,address);
                  }}
                  style={{ marginRight: "5px" }}
                />
                {tools.shorten(row.address, !props.edit ? 4 : 2)}
              </small>
              <br />
              <small>
                <strong>{row.short}</strong>
              </small>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}
export default ContactList;
