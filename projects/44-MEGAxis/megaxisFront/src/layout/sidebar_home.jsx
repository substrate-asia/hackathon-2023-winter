import React, {useEffect, useState} from "react";

import "./layout.css"
import {useNavigate} from "react-router-dom";
import {ReactComponent as General} from "../assets/icon/layout-2-line.svg"
import {ReactComponent as Academic} from "../assets/icon/git-repository-fill.svg"
import {ReactComponent as Marketing} from "../assets/icon/coins-line.svg"
import {ReactComponent as Software} from "../assets/icon/code-box-fill.svg"
import {ReactComponent as Business} from "../assets/icon/briefcase-5-line.svg"
import {ReactComponent as Others} from "../assets/icon/more-fill.svg"

const SidebarHome = () => {
    const [curType, setCurType] = useState(0);
    const navigate = useNavigate();
    function toIndex() {
        navigate('/');
    }
    function handleToPrompt() {
        setCurType(1);
        navigate('/prompt-nft/1');
    }
    function handleToAi() {
        setCurType(2);
        // navigate('/prompt-nft');
        window.open("http://megaxis.ai:3001/");
    }
    function handleToCreate() {
        setCurType(3);
        navigate('/create');
    }
    function handleToGit() {
        setCurType(4);
        window.open("https://github.com/TieProtocol");
    }
    function handleAbout() {
        setCurType(5);
    }
    function handleOthers() {
        setCurType(6);
    }
    return (
        <div className="tabbar">
            <div className="logo" onClick={toIndex}>
                {/* 放置Logo的地方 */}
                <img className="logo-img" src={require("../assets/logo/megaxis.png")} alt="Logo" />
            </div>
            <div className="menu">
                <div className={curType===1? "menu-item selected" : "menu-item"}
                     onClick={handleToPrompt}
                >
                    <General fill="#ffffff" className="icon10"/>
                    {/*<FaHome className="menu-item-icon" />*/}
                    <span className="menu-item-text">Prompt Market</span>
                </div>
                <div className={curType===2? "menu-item selected" : "menu-item"}
                     onClick={handleToAi}
                >
                    <Academic fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">AI Tools</span>
                </div>
                <div className={curType===3? "menu-item selected" : "menu-item"}
                     onClick={handleToCreate}
                >
                    <Marketing fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Create Prompt</span>
                </div>
                <div className={curType===4? "menu-item selected" : "menu-item"}
                     onClick={handleToGit}
                >
                    <Software fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Get on Github</span>
                </div>
                <div className={curType===5? "menu-item selected" : "menu-item"}
                     onClick={handleAbout}
                >
                    <Business fill="#ffffff" className="icon10" />
                    <span className="menu-item-text">Know About Us</span>
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

export default SidebarHome;