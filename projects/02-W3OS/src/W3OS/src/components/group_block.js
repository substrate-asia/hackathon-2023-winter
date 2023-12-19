import { Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import RUNTIME from "../lib/runtime";
import tools from "../lib/tools";
import IMGC from "../open/IMGC";

function GroupBlock(props) {
  const size = {
    row: [12],
    list: [1, 3, 8],
    opt: [7, 5],
    header: [10, 2],
  };

  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");
  let [disable, setDisalbe] = useState(true);
  let [my, setMy] = useState("");


  const self = {
    click: (index) => {
      list[index].selected = !list[index].selected;
      self.fresh();
    },
    clickAdd: () => {
      setDisalbe(true);
      const accs = self.getSelected(list);
      IMGC.group.create(accs, (res) => {
        console.log(`Group created: ${JSON.stringify(res)}`);
        IMGC.group.detail(res.id, (gp) => {
          console.log(`Group details: ${JSON.stringify(gp)}`);

          setInfo("Group created successful.");
          setTimeout(() => {
            setDisalbe(false);

            props.back();
          }, 1500);
        });
      });
    },
    fresh: () => {
      const nlist = JSON.parse(JSON.stringify(list));
      setList(nlist);
    },
    getSelected: (accs) => {
      if (!my) return false;
      const list = [my];
      for (let i = 0; i < accs.length; i++) {
        if (accs[i].selected) list.push(accs[i].address);
      }
      return list;
    },
  };

  useEffect(() => {
    RUNTIME.getAccount((acc) => {
      if (acc && acc.address) {
        setDisalbe(false);
        setMy(acc.address);
      } else {
        setInfo(`Please set your account first.`);
      }
    });
    RUNTIME.getContact((res) => {
      //console.log(res);
      const nlist = [];
      for (let acc in res) {
        const row = res[acc];
        row.address = acc;
        row.selected = false;
        nlist.push(row)
      }
      setList(nlist);
    });
  }, []);

  return (
    <Row>
      <Col className="pt-2 pb-2 text-secondary" xs={size.header[0]} sm={size.header[0]} md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]}>
        Your address: {tools.shorten(my)}
      </Col>
      <Col className="pt-2 pb-2 text-secondary text-end" xs={size.header[1]} sm={size.header[1]} md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]}>
        <span className="status green" style={{ margin: "0 auto" }}></span>
      </Col>
      {list.map((row, index) => (
        <Col className="pt-2" xs={size.row[0]} sm={size.row[0]} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}
          key={index} onClick={(ev) => {
            self.click(index);
          }}>
          <Row>
            <Col className="text-center" xs={size.list[0]} sm={size.list[0]} md={size.list[0]} lg={size.list[0]} xl={size.list[0]} xxl={size.list[0]}>
              <input type="checkbox"
                onChange={(ev) => { }}
                checked={row.selected}
                style={{ marginTop: "15px" }} />
            </Col>

            <Col xs={size.list[2]} sm={size.list[2]} md={size.list[2]} lg={size.list[2]} xl={size.list[2]} xxl={size.list[2]}>
              <strong>{row.short}</strong>
              {row.intro},{tools.shorten(row.address)}
            </Col>
            <Col xs={size.list[1]} sm={size.list[1]} md={size.list[1]} lg={size.list[1]} xl={size.list[1]} xxl={size.list[1]}>
              <Image
                src={RUNTIME.getAvatar(row.address)}
                rounded
                width="100%"
                style={{ maxWidth: "60px", marginTop: "-15px" }}
              />
            </Col>
          </Row>
          <hr />
        </Col>
      ))}
      <Col xs={size.opt[0]} sm={size.opt[0]} md={size.opt[0]} lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]}>
        {info}
      </Col>
      <Col className="text-end" xs={size.opt[1]} sm={size.opt[1]} md={size.opt[1]} lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]}>
        <button disabled={disable} className="btn btn-md btn-primary" onClick={(ev) => {
          self.clickAdd();
        }}>Block</button>
      </Col>
    </Row>
  );
}
export default GroupBlock;
