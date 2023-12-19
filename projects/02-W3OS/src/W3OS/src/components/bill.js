import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import tools from "../lib/tools";
import RUNTIME from "../lib/runtime";
import BILL from "../lib/bill";
import SCROLLER from "../lib/scroll";

import Chat from "./chat";
import ContactTitle from "./contact_title";
import Transaction from "./transaction";

function Bill(props) {
  const size = {
    row: [12],
    divide: [4, 4, 4],
    bill: [3, 9],
  };
  const count = props.count;

  let [hide, setHide] = useState(false);
  let [history, setHistory] = useState([]);

  const UI=RUNTIME.getUI();
  const self = {
    sort: (list) => {
      const ss = [];
      const map = {};
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        ss.push(row.stamp);
        map[row.stamp] = row;
      }
      const order = ss.sort((a, b) => {
        return b - a;
      });

      const arr = [];
      for (let i = 0; i < order.length; i++) {
        const stamp = order[i];
        arr.push(map[stamp]);
      }
      return arr;
    },
    format: (list) => {
      for (let i = 0; i < list.length; i++) {
        list[i].date = new Date(list[i].stamp);
      }
      return list;
    },
    showDate: (stamp) => {
      const time = new Date(stamp);
      return time.toLocaleDateString() + " " + time.toLocaleTimeString();
    },
    click: (block_hash, transfer_hash, row) => {
      UI.dialog.show(
        <Transaction
          block={block_hash}
          hash={transfer_hash}
          row={JSON.stringify(row)}
        />,
        "Transaction details",
      );
    },
  };

  useEffect(() => {
    if (props.show) {
      RUNTIME.getAccount((fa) => {
        if (!fa) {
          setHide(true);
          return false;
        }
        const acc = fa.address;
        const page = 1;
        BILL.page(acc, page, (rows) => {
          if (!rows) {
            setHide(true);
            return false;
          }
          setHistory(self.sort(rows));
        });
      });
    } else {
      setHide(true);
    }
    SCROLLER.allowScroll();
  }, [count]);
  return (
    <Row className="pt-2" index={count}>
      <Col
        hidden={hide}
        xs={size.divide[0]}
        sm={size.divide[0]}
        md={size.divide[0]}
        lg={size.divide[0]}
        xl={size.divide[0]}
        xxl={size.divide[0]}
        className="pt-2"
      >
        <hr />
      </Col>
      <Col
        hidden={hide}
        xs={size.divide[1]}
        sm={size.divide[1]}
        md={size.divide[1]}
        lg={size.divide[1]}
        xl={size.divide[1]}
        xxl={size.divide[1]}
        className="pt-2 text-center"
      >
        <span style={{ color: "#BBBBBB", fontWeight: "500" }}>Bill List</span>
      </Col>
      <Col
        hidden={hide}
        xs={size.divide[2]}
        sm={size.divide[2]}
        md={size.divide[2]}
        lg={size.divide[2]}
        xl={size.divide[2]}
        xxl={size.divide[2]}
        className="pt-2"
      >
        <hr />
      </Col>

      <div id="bill_container">
        <Col
          xs={size.row[0]}
          sm={size.row[0]}
          md={size.row[0]}
          lg={size.row[0]}
          xl={size.row[0]}
          xxl={size.row[0]}
        >
          <Row style={{ height: "100%", overflow: "hidden" }}>
            {history.map((row, index) => (
              <Col
                key={index}
                className="pb-4"
                xs={size.row[0]}
                sm={size.row[0]}
                md={size.row[0]}
                lg={size.row[0]}
                xl={size.row[0]}
                xxl={size.row[0]}
              >
                <Row>
                  <Col
                    className="text-center"
                    xs={size.bill[0]}
                    sm={size.bill[0]}
                    md={size.bill[0]}
                    lg={size.bill[0]}
                    xl={size.bill[0]}
                    xxl={size.bill[0]}
                  >
                    <img
                      className="pb-2"
                      style={{ width: "60px" }}
                      src={RUNTIME.getAvatar(row.to)}
                      alt="user logo"
                      onClick={(ev) => {
                        props.agent.setAccount(row.to);
                      }}
                    />
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        UI.dialog.show(
                          <Chat address={row.to} fresh={() => {}} fixed={false} height={560}/>,
                          <ContactTitle address={row.to}/>,
                        );
                      }}
                    >
                      Chat
                    </button>
                  </Col>
                  <Col
                    xs={size.bill[1]}
                    sm={size.bill[1]}
                    md={size.bill[1]}
                    lg={size.bill[1]}
                    xl={size.bill[1]}
                    xxl={size.bill[1]}
                    onClick={(ev) => {
                      self.click(row.block, !row.hash ? "" : row.hash, row);
                    }}
                  >
                    <table style={{ width: "90%" }}>
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>{row.amount}</strong>
                          </td>
                          <td style={{ textAlign: "right" }}>units</td>
                        </tr>
                        <tr>
                          <td>
                            On{" "}
                            <strong>
                              {!row.more || !row.more.blocknumber
                                ? ""
                                : row.more.blocknumber.toLocaleString()}
                            </strong>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            Index{" "}
                            <strong>
                              {!row.more || !row.more.index
                                ? ""
                                : row.more.index}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td>{self.showDate(row.stamp)}</td>
                          <td style={{ textAlign: "right" }}></td>
                        </tr>
                        <tr>
                          <td>{tools.shorten(row.hash)}</td>
                          <td style={{ textAlign: "right" }}>{row.status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </Col>
      </div>
    </Row>
  );
}

export default Bill;
