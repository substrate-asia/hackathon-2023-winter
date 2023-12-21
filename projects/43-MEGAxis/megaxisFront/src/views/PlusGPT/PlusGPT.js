import React, {useCallback, useContext, useEffect, useState} from "react"
import { Link } from "react-router-dom"

import { Card, List, Modal, notification, Pagination } from "antd"
import { FaPaperPlane } from "react-icons/fa"
import { ReactComponent as Close } from "../../assets/icon/close-line 1.svg"
import "./plusGPT.css"
import PromptCard from "./components/PromptCard"
import { askGPT } from "../../api/PlusGPT"
import { getFavorites, getBought, getByType, getByKey, getDetail, purchase } from "../../api/PromptNFT"
import { getToken } from "../../utils/auth"
import { TypeContext } from "../../layout"
import { ReactComponent as TbUPLine } from '../../../src/assets/icon/thumb-up-line.svg'
import { ReactComponent as TbDOWNLine } from '../../../src/assets/icon/thumb-down-line.svg'
import { Spin } from 'antd';
import {ScoreContext} from "../../contexts/ScoreContext";
import "../../styles/index.css"
import Navbar from "../../layout/navbar";
import SidebarHome from "../../layout/sidebar_home";


const PlusGPT = (props) => {
    const { updateScore } = useContext(ScoreContext);
    const helloWord = "Hey there! This is Megaxis.\n  I’m here to make it easier to access AIGC. \nConnect your wallet first and talk to me - I can help you perform various tasks."
    const [chatData, setChatData] = useState([{ id: 0, context: helloWord }])
    const [currentAsk, setCurrentAsk] = useState('')
    const [askData, setAskData] = useState([])
    const [pageInfo, setPageInfo] = useState([1, 3])
    const [showPrompt, setShowPrompt] = useState([{ params: [] }, { params: [] }])
    const [usePrompt, setUsePrompt] = useState(false)
    // 购买确认栏
    const [preBuy, setPreBuy] = useState('');
    const [api, contextHolder] = notification.useNotification()
    const [modalOpen, setModalOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [loading, setLoading] = useState(true);
    const [isNotify, setIsNotify] = useState(9);
    //当前显示的信息
    const [curPrompt, setCurPrompt] = useState({
        name: "default",
        author: "Frank",
        params: ['xname']
    })
    const [promptParams, setPromptParams] = useState([]) // 用户使用prompt提问时填写的参数
    const [total, setTotal] = useState(200)
    // const pageSize = 1;
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if(isNotify === 0) {
            api['success']({
                message: 'buy success',
                description:
                    'You can use this prompt now!',
            })
        } else if(isNotify === 1){
            api['success']({
                message: 'buy success',
                description:
                    'You can use this prompt now!',
            })
        } else {
            console.log(1);
        }
    }, [isNotify])
    function handleChangePage (page, pageSize) {
        console.log("page: ", page)
        console.log("pagesize: ", pageSize)
        setPageInfo([page, pageSize])
    }
    function handleBuy () {
        setConfirmLoading(true)
        purchase({pid: preBuy}).then(res => {
            setModalOpen(false)
            setConfirmLoading(false)
            setIsNotify(0)
            updateScore();
        }).catch(err => {
            setModalOpen(false);
            setConfirmLoading(false);
            setIsNotify(1);
            updateScore();
        })
        console.log(curPrompt.name)
    }
    function handleSelectPrompt (item) {
        setPreBuy(item.pid);
        getDetail({ pid: item.pid }).then(res => {
            const info = res.data
            if (info.auth_level === 3) {
                setModalOpen(true)
            } else {
                setUsePrompt(true)
                let s = info.params.split(',')
                if(s[0] === ''){
                    s = []
                }
                info.params = s
                setCurPrompt(info)
            }
        })

        console.log("item", item)
        // console.log(item);
        // console.log(index);
    }
    const changeParams = useCallback((val, index) => {
        let arr = promptParams
        arr[index] = val.target.value
        setPromptParams(arr)
        // console.log(promptParams[index]);
    })

    const handleAskChange = useCallback((val) => {
        let current = val.target.value
        setCurrentAsk(val.target.value)
        if (current === '') {
            getBoughtDefault()
        }
        else {
            const requestBody = {
                key: current,         //输入内容
                offset: (pageInfo[0] - 1) * pageInfo[1],          //分页查询,第几页
                limit: pageInfo[1]  //分页查询，每页几个
            }
            getByKey(requestBody).then(res => {
                const newData = res.data.PromptInfos === null ? [] : res.data.PromptInfos
                setShowPrompt(newData)

            })
        }

    }, [])
    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            handleSubmit()
        } else if (e.key === "e") {
            console.log(askData)
            console.log(chatData)
        }
    }
    function handleSubmit () {
        if (getToken() === '' || getToken() === undefined) {
            alert('Please connect wallet first')
            return
        }
        if (!usePrompt) {
            chatData.push({ id: chatData.length, context: currentAsk })
            askData.push({ type: 3, pid: curPrompt.pid, params: [], content: currentAsk })
            setChatData(chatData)
            setAskData(askData)
        } else {
            chatData.push({ id: chatData.length, context: 'new question: use prompt: ' + curPrompt.name })
            setChatData(chatData)
            // const newAsk = {type:2, pid: '', params: promptParams, content:'' };
            askData.push({ type: 2, pid: curPrompt.pid, params: promptParams, content: '' })
            setAskData(askData)
        }
        setCurrentAsk('')

        askGPT({ data: askData }).then(res => {
            const newChatData = [
                ...chatData,
                { id: chatData.length, context: res.data.data },
            ]
            const newAskData = [
                ...askData,
                { type: 1, pid: '', content: res.data.data },
            ]

            setChatData(newChatData)
            setAskData(newAskData)
        })
    }
    function getBoughtDefault () {
        const requestBody = {
            offset: (pageInfo[0] - 1) * pageInfo[1],          //分页查询,第几页
            limit: pageInfo[1]  //分页查询，每页几个
        }
        getBought(requestBody).then(res => {
            let newData = res.data.PromptInfos === null ? [] : res.data.PromptInfos
            setShowPrompt(newData)

        })
    }

    const getGeneralPrompt = async () =>{
        const requestBody = {
            offset: (pageInfo[0] - 1) * pageInfo[1],          //分页查询,第几页
            limit: pageInfo[1]  //分页查询，每页几个
        }
        try{
            await  getByKey(requestBody).then(res => {
                const newData = res.data.PromptInfos === null? []: res.data.PromptInfos;
                setShowPrompt(newData)
                setTotal(Math.ceil(res.data.total ))
                setLoading(false); // 设置loading为false
            })
        }catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }


    const handleVote = (id, voteType) => {
        console.log(`Voted ${voteType} on message with id: ${id}`)
        // Handle the voting logic here
    }

    useEffect(() => {
        getGeneralPrompt()
    }, [props.type])

    return (
        <div>
            <SidebarHome />
            <div className="right-side">
                <Navbar />
                <div className="lower">
                    {contextHolder}
                    <Modal
                        title="未购买的prompt"
                        open={modalOpen}
                        onOk={handleBuy}
                        confirmLoading={confirmLoading}
                        onCancel={() => { setModalOpen(false) }}
                    >
                        <p>暂无使用权限，是否购买该prompt？</p>
                    </Modal>
                    <div className='chat-left'>

                        <div className="box" style={{ height: "100%" }}>
                            <div className="box-header">
                                <span className="box-title" onClick={() => { console.log(showPrompt) }}>Recommended prompt</span>
                                <input
                                    className="search-bar"
                                    type="text"
                                    placeholder="Search"
                                />
                            </div>
                            <div className="box-content">
                                {loading ? (
                                    <div className="loading">
                                        <Spin tip="Loading..." />
                                    </div>
                                ) : (
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    // grid={{ gutter: 16, column: 3 }}
                                    dataSource={showPrompt}
                                    split={false}
                                    pagination={{
                                        simple: 'simple', pageSize: pageInfo[1], total: 56000, onChange: (page) => { handleChangePage(page, pageInfo[1]); getGeneralPrompt() }
                                    }}
                                    scroll={{ y: 240 }}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <PromptCard onClick={() => handleSelectPrompt(item)} props={item} key={index}></PromptCard>
                                        </List.Item>
                                    )}
                                >
                                </List>)}

                            </div>
                        </div>

                    </div>
                    <div className="chat-container">
                        <div className="chat-window">
                            {chatData.map((item) => {
                                const formattedContent = String(item.context).split('\n').map((line, index) => (
                                    <p key={`${item.id}-${index}`}>{line}</p >
                                ))

                                return (
                                    <React.Fragment key={item.id}>
                                        <div className="chat-message">
                                            <div className="chat-user">[{item.id % 2 ? 'YOU' : 'MEGAXIS'}]</div>
                                            <div className="chat-content">{formattedContent}
                                                {item.id > 0 && item.id % 2 === 0 && (
                                                    <div className="voting-buttons">
                                                        <button className="upvote" onClick={() => handleVote(item.id, 'upvote')}><TbUPLine /></button>
                                                        <button className="downvote" onClick={() => handleVote(item.id, 'downvote')}><TbDOWNLine /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.id < chatData.length - 1 && <div className="chat-divider" />}
                                    </React.Fragment>
                                )
                            })}
                            {usePrompt ? (<div className="prompt-use-card">
                            <div className="bigbox">
                                <div className="prompt-use-info">
                                    {curPrompt.name}
                                    <span className="prompt-use-author">
                                        by <a href="#" className="author">{curPrompt.author}</a>
                                    </span>
                                </div>
                            </div>
                                 <div className="divider"></div>
                                <div className="prompt-params">

                                    { curPrompt.params.map((item, index) =>
                                        <div className="params-form" key={index}>
                                            {item}
                                            <input className="params-input"
                                                placeholder="Optional"
                                                onChange={(value) => changeParams(value, index)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            ) : <div />}
                        </div>
                        <div className="input-container">
                            <textarea
                                className="input-box"
                                onChange={handleAskChange}
                                value={currentAsk}
                                type="text"
                                placeholder="Type your message here"
                                onKeyUp={handleKeyUp}
                                disabled={usePrompt}
                                rows="1"
                                maxLength="3000"
                            />
                            <FaPaperPlane className="send-button" onClick={handleSubmit} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PlusGPT