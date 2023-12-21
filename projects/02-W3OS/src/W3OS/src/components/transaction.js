import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";
import BILL from "../lib/bill";

function Transaction(props) {
  const size = {
    row: [12],
  };
  const block = props.block;
  const hash = props.hash;
  const row = JSON.parse(props.row);

  let [details, setDetails] = useState("");

  const self = {
    status: (evs, amount, from, to) => {
      const transfer = {
        index: 0,
        success: false,
      };
      const chk_a = evs.toJSON();
      const chk_b = evs.toHuman();
      console.log(chk_b);

      const map = {};
      for (let i = 0; i < chk_b.length; i++) {
        const row = chk_b[i];
        if (
          row.event.index === "0x0000" &&
          parseInt(row.phase.ApplyExtrinsic) !== 0
        ) {
          map[row.phase.ApplyExtrinsic] = true;
        }

        if (row.event.index === "0x0602") {
          const data = chk_a[i].event.data;
          if (
            data[0] === from &&
            data[1] === to &&
            data[2] === amount * 1000000000000
          ) {
            transfer.index = parseInt(row.phase.ApplyExtrinsic);
          }
        }
      }

      if (map[transfer.index]) {
        transfer.success = true;
      }
      return transfer;
    },
    check: (ck) => {
      RUNTIME.getAccount((fa) => {
        RUNTIME.getActive((pok) => {
          if (pok === null) return false;
          console.log(block);
          pok.rpc.chain
            .getBlock(block)
            .then((res) => {
              const bk = res.toJSON();
              pok
                .at(block)
                .then((apiAt) => {
                  apiAt.query.system
                    .events()
                    .then((res) => {
                      const status = self.status(
                        res,
                        row.amount,
                        fa.address,
                        row.to,
                      );
                      const confirm = {
                        amount: row.amount,
                        status: "Finalized",
                        to: row.to,
                        block: block,
                        hash: row.hash,
                        stamp: tools.stamp(),
                        more: {
                          blocknumber: bk.block.header.number,
                          index: status.index,
                        },
                      };
                      console.log(confirm);
                      BILL.update(fa.address, [confirm], (res) => {
                        self.fresh(confirm);
                      });
                    })
                    .catch((err) => {
                      setDetails(`Invalid transaction data.`);
                    });
                })
                .catch((err) => {
                  setDetails(`Invalid transaction data.`);
                });
            })
            .catch((error) => {
              setDetails(`Invalid transaction data.`);
            });
        });
      });
    },
    fresh: (row) => {
      switch (row.status) {
        case "InBlock":
          setDetails(
            <p>
              Amount <strong>{row.amount}</strong>, checking status...
              <br />
              At {tools.toDate(row.stamp)}
            </p>,
          );
          self.check();
          break;
        case "Finalized":
          setDetails(
            <p>
              On <strong>{row.more.blocknumber.toLocaleString()}</strong>,
              amount <strong>{row.amount}</strong> index{" "}
              <strong>{row.more.index}</strong>
              <br />
              At {tools.toDate(row.stamp)}
            </p>,
          );
          break;

        default:
          break;
      }
    },
  };

  useEffect(() => {
    self.fresh(row);
  }, []);

  return (
    <Row className="pt-1">
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <h5>Summary</h5>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        {details}
      </Col>
      <Col
        className="pt-3"
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <small>Block Hash</small>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <textarea
          name=""
          style={{ width: "100%" }}
          rows="3"
          disabled={true}
          defaultValue={block}
        ></textarea>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <small>Transaction Hash</small>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <textarea
          name=""
          style={{ width: "100%" }}
          rows="3"
          disabled={true}
          defaultValue={hash}
        ></textarea>
      </Col>
    </Row>
  );
}
export default Transaction;
