import React, { useEffect, useState, } from "react";
import { Button, Card, Col, Row } from "antd";
import "./index.css";
import {getByKey, getAllPrompt} from "../../api/PromptNFT";
import {generateLikes} from "../../utils/tools";
import "../../styles/index.css"
import Sidebar from "../../layout/sidebar";
import Navbar from "../../layout/navbar";
const FireIcon = () => {
  return (
    <svg
      className="text-lg mr-[1px] z-10"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9z"></path>
    </svg>
  )
}

const Divider = (props) => {
  const { value, } = props;
  return (
    <>
      <h2
        style={{
          color: "rgba(229, 231, 235, 1)",
          fontWeight: 700,
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
          marginBlock: "1rem .5rem",
        }}
      >{value}</h2>
    </>
  )
}

const CardItem = (props) => {
  const { href, image, title, likes, description, categories, } = props;

  return (
    <>
      <a target="_blank" href={href}>
        <div className="card-container">
          <img src={image} style={{ width: 130, height: 130, opacity: .7, objectFit: "cover", overflow: "hidden", }} />
          <div
            style={{
              marginInlineStart: "0.5rem",
              padding: "1rem",
              paddingTop: "0.5rem",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", }}>
              <p
                style={{
                  fontSize: "1.25rem",
                  lineHeight: "1.75rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  margin: 0,
                  // color: "rgba(209, 213, 219, 1)",
                  letterSpacing: ".025em",
                  wordWrap: "break-word",
                }}
              >{title}</p>
              <div style={{width: 50, textAlign:"left", fontWeight: 500, fontSize: ".875rem", lineHeight: "1.25rem", }}><FireIcon />{likes}</div>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  marginBottom: ".5rem",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  color: "rgba(209, 213, 219, 1)",
                  fontWeight: 300,
                  fontSize: ".875rem",
                  lineHeight: "1.25rem",
                }}
              >{description}</p>
            </div>
            <div
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {categories?.map((item, index) =>
                <span
                  key={index}
                  style={{
                    display: "inline-flex",
                    verticalAlign: "top",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    maxWidth: "100%",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    outline: "transparent solid 2px",
                    outlineOffset: 2,
                    borderRadius: "0.375rem",
                    minHeight: "1.25rem",
                    minWidth: "1.25rem",
                    fontSize: ".75rem",
                    paddingInline: ".5rem",
                    marginRight: ".25rem",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "rgba(255, 255, 255, 0.80)",
                    textTransform: "capitalize",
                  }}
                >{item}</span>
              )}
            </div>
          </div>
        </div>
      </a>
    </>
  )
}

const PromptNFT = (props) => {
  const { } = props;
  const [promptGroups, setPromptGroups] = useState({});
  const [page, setPage] = useState({ offset: 1, limit: 10, total: 0, });

  const onPage = (reset) => {
    let body = {
      offset: page.offset*10,
      limit: 10,
      total: 0,
      // ...page,
    }
    console.log(page)

    if (reset) {
      body.offset = 1;
    }

    // let options = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', },
    //   body: JSON.stringify(body),
    // }

    getByKey(body).then(response => {
      let data = handler(response.data.PromptInfos);
      if (reset) {
        setPromptGroups(data);
      } else {
        setPromptGroups(prev => {
            let list = Object.values(prev).reduce((a, b) => [...a, ...b], []);
            return handler([...list, ...response.data.PromptInfos]);
        });
      }

      setPage(prev => ({ ...prev, offset: prev.offset + 1,total: response.data.total }));
    });
  }

  const loadData = () => {
    setPage(prev => ({ ...prev, offset: prev.offset + 1, }));
    onPage();
  }

  useEffect(() => {
   onPage();
//    setPromptGroups(handler(PROMPTS));
  }, []);

  useEffect(() =>{
console.log(promptGroups);
  }, [])

  return (
      <div>
          <Sidebar />
          <div className="right-side">
              <Navbar />
              <div style={{ display: "flex", justifyContent: "center", background: "rgba(26, 27, 30, 1)", minHeight: "100vh", overflow: "auto", textAlign: 'start', paddingTop: 30, }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "row", maxWidth: 1600, }}>
                    <div style={{ flex: 1, paddingInline: ".5rem 3rem", }}>
                      {Object.keys(promptGroups).map((key, index) => {
                        let time = new Date(key);
                        return (
                          <React.Fragment key={index}>
                            <Divider value={`${time.getMonth() + 1} 月 ${time.getDate()} 日${WEEKDAY[time.getDay()]} AI 提示: 共56214 个`} />
                            <Row gutter={[12, 12]}>
                              {promptGroups[key]?.map((item, i) => (
                                <Col key={item.id+i+index} span={12}>
                                  <CardItem
                                    title={item.name}
                                    likes={generateLikes()}
                                    description={item.desc}
                                    categories={item.creator}
                                    image={item.avatar}
                                  />
                                </Col>
                              ))}
                            </Row>
                          </React.Fragment>
                        )
                      })}
                      <Row gutter={[12, 12]}>
                        <Col span={24} style={{ textAlign: "center", }}>
                            <Button
                                style={{ fontWeight: 500, background: "#2e3033", color: "#fff", marginBlock: "1rem 3rem", }}
                                onClick={loadData}
                            >LoadMore</Button>
                            </Col>
                      </Row>
                    </div>

                    <div style={{ width: 400, display: "none", }}>
                      <Card bordered style={{ marginTop: 24, }}></Card>
                    </div>
                  </div>
              </div>
          </div>
      </div>

  )
}


export default PromptNFT;



function handler(data) {
  let groups = {};

  if (!Array.isArray(data)) {
    return groups;
  }

  for (let item of data) {
    // 以修改时间为标准进行分组
    let time = new Date(item.createTime);
    let key = [time.getFullYear(), (time.getMonth() + 1), time.getDate()].join("-");
    if (groups[key]) {
      groups[key].push(item);
    } else {
      groups[key] = [item];
    }
  }

  Object.values(groups).forEach(item => {
    item?.sort((a, b) => new Date(a.createTime).valueOf() - new Date(b.createTime).valueOf());
  });

  return groups;
}

const WEEKDAY = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

const TEMP ={
    "id": 356,
    "pid": "84dbad4044bf4b6194a34471057e9625",
    "name": "Friend",
    "desc": "Friend",
    "price": 0,
    "type": 1,
    "content": "",
    "params": "",
    "author": "e8d9c0cbc47f435f8a978630eefd127a",
    "taglist": "",
    "avatar": "",
    "examples": "",
    "createTime": "2023-04-22 12:25:14",
    "updateTime": null,
    "nftid": "",
    "likes": 0,
    "dislikes": 0,
    "attitude": 0
}

const PROMPTS = [
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "uiN6qci-vEJESFnkg6Hz1",
    title: "Harness the power of activerecall",
    description: "Challenging Q",
    categories: ["Problem Solving", "creative", "Problem Solving", "creative", "Problem Solving", "creative", "creative", "Problem Solving", "creative"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 14,
    href: "/prompt/uiN6qci-vEJESFnkg6Hz1",
    "update_time": "2022-12-22",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), // "hsymnTLG-1ly33PcDETXI",
    title: "lmplement a deliberate practice routine",
    description: "Deliberate practice is a focused approach to learning and improving skills.Deliberate practice is a focused approach to learning and improving skills.Deliberate practice is a focused approach to learning and improving skills.",
    categories: ["#PracticalLearning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 12,
    href: "/prompt/hsymnTLG-1ly33PcDETXI",
    "update_time": "2022-12-22",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "hRb7IApCILZFd2NRdYd40",
    title: "Learning Modalities Learning Modalities Learning Modalities Learning Modalities",
    description: "Experiment with different learning modalities",
    categories: ["Learning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/3.jpg",
    likes: 11,
    href: "/prompt/hRb7IApCILZFd2NRdYd40",
    "update_time": "2022-12-22",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "uiN6qci-vEJESFnkg6Hz1",
    title: "Harness the power of activerecall",
    description: "Challenging Q",
    categories: ["Problem Solving", "creative"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 14,
    href: "/prompt/uiN6qci-vEJESFnkg6Hz1",
    "update_time": "2022-12-22",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), // "hsymnTLG-1ly33PcDETXI",
    title: "lmplement a deliberate practice routine",
    description: "Deliberate practice is a focused approach to learning and improving skills.",
    categories: ["#PracticalLearning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 12,
    href: "/prompt/hsymnTLG-1ly33PcDETXI",
    "update_time": "2022-12-21",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "hRb7IApCILZFd2NRdYd40",
    title: "Learning Modalities",
    description: "Experiment with different learning modalities",
    categories: ["Learning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/3.jpg",
    likes: 11,
    href: "/prompt/hRb7IApCILZFd2NRdYd40",
    "update_time": "2022-12-12",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "uiN6qci-vEJESFnkg6Hz1",
    title: "Harness the power of activerecall",
    description: "Challenging Q",
    categories: ["Problem Solving", "creative"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 14,
    href: "/prompt/uiN6qci-vEJESFnkg6Hz1",
    "update_time": "2022-12-22",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), // "hsymnTLG-1ly33PcDETXI",
    title: "lmplement a deliberate practice routine",
    description: "Deliberate practice is a focused approach to learning and improving skills.",
    categories: ["#PracticalLearning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/6.jpg",
    likes: 12,
    href: "/prompt/hsymnTLG-1ly33PcDETXI",
    "update_time": "2022-12-14",
  },
  {
    id: Math.random().toString(36).substr(2).toLowerCase(), //  "hRb7IApCILZFd2NRdYd40",
    title: "Learning Modalities",
    description: "Experiment with different learning modalities",
    categories: ["Learning"],
    image: "https://flow-prompt-covers.s3.us-west-1.amazonaws.com/general/3.jpg",
    likes: 11,
    href: "/prompt/hRb7IApCILZFd2NRdYd40",
    "update_time": "2022-12-17",
  },
];