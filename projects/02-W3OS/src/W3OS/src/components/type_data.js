import { Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import RUNTIME from "../lib/runtime";
import Copy from "../lib/clipboard";

function TypeData(props) {
  const size = {
    row: [12],
    owner: [9, 3],
    basic: [6, 6],
  };

  const anchor = props.link;
  let [name, setName] = useState("");
  let [owner, setOwner] = useState("");
  let [block, setBlock] = useState(0);
  let [bytes, setBytes] = useState(0);
  let [raw, setRaw] = useState("");
  let [stamp, setStamp] = useState(0);
  let [protocol, setProtocol] = useState("");

  let [disable, setDisable] = useState(false);
  let [clip, setClip] = useState("Copy");

  const self = {
    copyAddress: (address) => {
      Copy(address);
      setDisable(true);
      setClip("Done");
      setTimeout(() => {
        setDisable(false);
        setClip("Copy");
      }, 1000);
    },
  };

  useEffect(() => {
    RUNTIME.getAPIs((APIs) => {
      APIs.Easy(anchor, (res) => {
        if (res.type === "unknow") return false;
        const target = res.location;
        const data = res.data[`${target[0]}_${target[1]}`];
        const bt =
          typeof data.raw !== "string"
            ? JSON.stringify(data.raw).length
            : data.raw.length;

        setName(data.name);
        setRaw(
          typeof data.raw !== "string" ? JSON.stringify(data.raw) : data.raw,
        );
        setBlock(data.block);
        setOwner(data.owner);
        setBytes(bt);
        setStamp(data.stamp);
        setProtocol(JSON.stringify(data.protocol));
      });
    });
  }, [anchor]);

  return (
    <Row>
      <Col
        xs={size.basic[0]}
        sm={size.basic[0]}
        md={size.basic[0]}
        lg={size.basic[0]}
        xl={size.basic[0]}
        xxl={size.basic[0]}
      >
        <small>Name</small>
        <h5>{name}</h5>
      </Col>
      <Col
        xs={size.basic[1]}
        sm={size.basic[1]}
        md={size.basic[1]}
        lg={size.basic[1]}
        xl={size.basic[1]}
        xxl={size.basic[1]}
      >
        <small>Block</small>
        <h5>{block.toLocaleString()}</h5>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <small>Anchor Link</small>
        <h5>{anchor}</h5>
      </Col>
      <Col
        xs={size.owner[0]}
        sm={size.owner[0]}
        md={size.owner[0]}
        lg={size.owner[0]}
        xl={size.owner[0]}
        xxl={size.owner[0]}
      >
        <small>Anchor Owner</small>
        <h5>{tools.shorten(owner, 10)}</h5>
      </Col>
      <Col
        className="text-end"
        xs={size.owner[1]}
        sm={size.owner[1]}
        md={size.owner[1]}
        lg={size.owner[1]}
        xl={size.owner[1]}
        xxl={size.owner[1]}
      >
        <Button
          disabled={disable}
          className="mt-4"
          size="sm"
          variant="secondary"
          onClick={(ev) => {
            self.copyAddress(owner);
          }}
        >
          {" "}
          {clip}{" "}
        </Button>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <small>Write Time</small>
        <h5>{tools.toDate(stamp)}</h5>
      </Col>
      <Col
        xs={size.row[0]}
        sm={size.row[0]}
        md={size.row[0]}
        lg={size.row[0]}
        xl={size.row[0]}
        xxl={size.row[0]}
      >
        <small>Protocol</small>
        <textarea
          style={{ width: "100%" }}
          rows="3"
          disabled={true}
          value={protocol}
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
        <small>Raw data ({bytes.toLocaleString()} Bytes)</small>
        <textarea
          style={{ width: "100%" }}
          rows="6"
          disabled={true}
          value={raw}
        ></textarea>
      </Col>
    </Row>
  );
}
export default TypeData;
