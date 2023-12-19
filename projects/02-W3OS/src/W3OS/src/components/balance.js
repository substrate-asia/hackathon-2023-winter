import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";
import Account from "../system/account";

function Balance(props) {
  const size = {
    login: [6, 6],
    row: [12],
  };
  let [amount, setAmount] = useState("");
  let [address, setAddress] = useState("");
  let [hide, setHide] = useState(true);

  const UI=RUNTIME.getUI();
  const self = {
    balance: (address, ck) => {
      RUNTIME.getAPIs((API) => {
        //console.log(API);
        if (API.AnchorJS.ready()) {
          return API.AnchorJS.balance(address, ck);
        }
        setTimeout(() => {
          self.balance(address, ck);
        }, 100);
      });
    },
  };

  useEffect(() => {
    RUNTIME.getAccount((sign) => {
      if (!sign) return false;
      setHide(false);
      const acc = sign.address;
      setAddress(acc);
      self.balance(acc, (res) => {
        if (res === false) {
          setAmount("unknown");
        } else {
          setAmount(parseFloat(res.free * 0.000000000001).toLocaleString());
        }
      });
    });
  }, []);

  return (
    <Row className="pt-1">
      <Col  hidden={hide} xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {tools.shorten(address, 10)} : <strong>{amount}</strong> units.
      </Col>
      <Col hidden={!hide} xs={size.login[0]} sm={size.login[0]} md={size.login[0]} lg={size.login[0]} xl={size.login[0]} xxl={size.login[0]}>
        Please login.
      </Col>
      <Col
        hidden={!hide}
        className="text-end"
        xs={size.login[1]}
        sm={size.login[1]}
        md={size.login[1]}
        lg={size.login[1]}
        xl={size.login[1]}
        xxl={size.login[1]}
      >
        <button
          className="btn btn-md btn-primary"
          onClick={(ev) => {
            UI.page(<Account />);
          }}
        >
          Network Account
        </button>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <hr />
      </Col>
    </Row>
  );
}
export default Balance;
