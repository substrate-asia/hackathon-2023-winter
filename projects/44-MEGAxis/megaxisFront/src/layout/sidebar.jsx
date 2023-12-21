import React, {useEffect, useState} from "react";

import "./layout.css"
import {useNavigate} from "react-router-dom";
import {ReactComponent as General} from "../assets/icon/layout-2-line.svg"
import {ReactComponent as Academic} from "../assets/icon/git-repository-fill.svg"
import {ReactComponent as Marketing} from "../assets/icon/coins-line.svg"
import {ReactComponent as Software} from "../assets/icon/code-box-fill.svg"
import {ReactComponent as Business} from "../assets/icon/briefcase-5-line.svg"
import {ReactComponent as Others} from "../assets/icon/more-fill.svg"
import { useParams } from "react-router"
const Sidebar = () => {
    const [curType, setCurType] = useState(0);
    const navigate = useNavigate();
    const routerParams = useParams();
    function toIndex() {
        navigate('/');
    }
    function handleGeneral() {
        setCurType(1);
        navigate('/prompt-nft/1');
    }
    function handleAcademic() {
        setCurType(2);
        navigate('/prompt-nft/2');
    }
    function handleMarket() {
        setCurType(3);
        navigate('/prompt-nft/3');
    }
    function handleSoft() {
        setCurType(4);
        navigate('/prompt-nft/4');
    }
    function handleBusiness() {
        setCurType(5);
        navigate('/prompt-nft/5');
    }
    function handleOthers() {
        setCurType(6);
        navigate('/prompt-nft/6');
    }
    useEffect(() => {
        setCurType(parseInt(routerParams.type))
    }, [])
    return (
        <div className="tabbar">
            <div className="logo" onClick={toIndex}>
                {/* 放置Logo的地方 */}
                <img className="logo-img" src={require("../assets/logo/megaxis.png")} alt="Logo" />
            </div>
            <div className="menu">
                <div className={curType===1? "menu-item selected" : "menu-item"}
                     onClick={handleGeneral}
                >
                    <General fill="#ffffff" className="icon10"/>
                    {/*<FaHome className="menu-item-icon" />*/}
                    <span className="menu-item-text">General</span>
                </div>
                <div className={curType===2? "menu-item selected" : "menu-item"}
                     onClick={handleAcademic}
                >
                    <Academic fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Academic</span>
                </div>
                <div className={curType===3? "menu-item selected" : "menu-item"}
                     onClick={handleMarket}
                >
                    <Marketing fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Crypto</span>
                </div>
                <div className={curType===4? "menu-item selected" : "menu-item"}
                     onClick={handleSoft}
                >
                    <Software fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Software Development</span>
                </div>
                <div className={curType===5? "menu-item selected" : "menu-item"}
                     onClick={handleBusiness}
                >
                    <Business fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Business</span>
                </div>
                <div className={curType===6? "menu-item selected" : "menu-item"}
                     onClick={handleOthers}
                >
                    <Others fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Others</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;