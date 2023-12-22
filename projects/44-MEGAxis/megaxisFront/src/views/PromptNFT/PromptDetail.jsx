import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import { getDetail, purchase } from "../../api/PromptNFT";
import {notification} from "antd";
import {ReactComponent as Close} from "../../assets/icon/close-line 1.svg";
import {ReactComponent as File} from "../../assets/icon/file-text-line 1.svg";
import {ReactComponent as CheckYes} from "../../assets/icon/checkbox-circle-line.svg";
import {ReactComponent as TypeIcon} from "../../assets/icon/price-tag-3-line.svg";
import { ReactComponent as EyeLine } from '../../assets/icon/eye-line.svg';
import { ReactComponent as MsgLine } from '../../assets/icon/message-line.svg';
import { ReactComponent as TbUPLine } from '../../assets/icon/thumb-up-line.svg';
import { ReactComponent as TbUPFill } from '../../assets/icon/thumb-up-fill.svg';
import { ReactComponent as TbDOWNLine } from '../../assets/icon/thumb-down-line.svg';
import { ReactComponent as TbDOWNFill } from '../../assets/icon/thumb-down-fill.svg';
import { ReactComponent as LinkLine } from '../../assets/icon/links-line.svg';
import { ReactComponent as AlertLine } from '../../assets/icon/alert-line.svg';
import { ReactComponent as StarLine } from '../../assets/icon/star-line.svg';
import { ReactComponent as StarFill } from '../../assets/icon/star-fill.svg';
import { ReactComponent as Avatar } from '../../assets/icon/avatar.svg';
import {formatPrice, transType} from "../../utils/tools";


import "./PromptDetail.css"

const PromptDetail = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {

    };
    const params = useParams();
    const [pInfo, setPInfo] = useState({
        "id": 0,
        "pid": "string",
        "name": "default-name",
        "desc": "string",
        "price": 4.99,
        "type": 0,
        "params": "string",
        "author": "Frank",
        "taglist": "string",
        "avatar": "string",
        "examples": "string",
        "createTime": "string",
        "updateTime": "string",
        "likes": 1000,
        "dislikes": 0,
        "attitude": 500,
        "auth_level": 1
    })
    function handleBuy() {
        const requestBody = {pid: pInfo.pid}
        purchase(requestBody).then(res => {
            if(res.code === 0){
                api['success']({
                    message: 'buy success',
                    description:
                        'You can use this prompt now!',
                });
            }else {
                api['error']({
                    message: 'buy fail',
                    description:
                        res.message,
                });
                console.log('fail');
            }

        }).catch(() => {
            console.log('error');
            api['error']({
                message: 'get failed',
                description:
                    'please try later or ask !',
            });
        })
        getDetailInfo();
    }
    function handleToMarket() {
        window.open("http://megaxis.ai:3000/");
    }
    function getDetailInfo() {
        const requestBody = {pid: params.id};
        getDetail(requestBody).then(res => {
            setPInfo(res.data);
        })
    }
    function handleBack() {
        window.history.back();
    }
    useEffect(() => {
        getDetailInfo();
    },[]);
    return (
        <>
            {contextHolder}
            <div className="lower">
                <div className="detail-card">
                    <div className="img-card">
                        <Close fill="#ffffff" className="close-icon" onClick={handleBack}/>
                        <File fill="#ffffff" className="file-icon" />
                    </div>
                    <div className="title-card">
                        <div className="prompt-title">
                            {pInfo.name}
                        </div>
                        <div className="first-info">
                            <div className="check-box">
                                <CheckYes fill="#ccc" />
                                <span className="small-name">Tested</span>
                            </div>
                            <div className="author-info">
                                <Avatar className="poyu"/>
                                <span className="small-name">{pInfo.author}</span>
                                <TypeIcon fill= "#ccc" className="tag-icon"/>
                                <span className="small-name">{pInfo.attitude}</span>
                            </div>
                        </div>
                        <div className="second-info">
                            <div className="check-box">
                                <CheckYes fill="#ccc" />
                                <span className="small-name">{transType(pInfo.type)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="likes-slot">

                            <div className="likes-square">
                                <EyeLine className="icon1"/>
                                <div className="likes-font">2000</div>
                            </div>


                        <div className="likes-square">
                            <MsgLine className="icon1"/>
                            <span className="likes-font">1000</span>
                        </div>
                        <div className="likes-square">
                            <TbUPLine className="icon1"/>
                            <span className="likes-font">2000</span>
                            <TbDOWNLine className="icon1"/>
                        </div>
                        
                        <div className="alert-square">
                            <StarLine className="icon1"/>
                        </div>
                        <div className="alert-square">
                            <AlertLine className="icon1"/>
                        </div>
                    </div>
                    <div className="prompt-desc">
                        {pInfo.desc}
                    </div>
                    <div className="price-tag">
                        {formatPrice(pInfo.price)}
                    </div>
                    <div className="buy-area">
                        <div className="button-area">
                            {pInfo.auth_level === 3?
                                <div className="buy-button" onClick={handleBuy}>
                                    <div className="buy-word"> Get Prompt</div>
                                </div>
                                :
                                <div className="buy-button">
                                    <div className="buy-word"> owned</div>
                                </div>
                            }
                            <div className="buy-button" onClick={handleToMarket}>
                                <div className="buy-word">buy NFT</div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* 这里是 PromptDetail 页面的内容 */}
            </div>
        </>
    );
};

export default PromptDetail;
