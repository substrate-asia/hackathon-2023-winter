import React, {createContext, useState} from "react";
import "./layout.css"
import ConnectWallet from "../components/ConnectWallet/connectWallet";
import {UserContext} from "../App";
import AppRoutes from "../routes";
import {useNavigate} from "react-router-dom";
import {ReactComponent as General} from "../assets/icon/layout-2-line.svg"
import {ReactComponent as Academic} from "../assets/icon/git-repository-fill.svg"
import {ReactComponent as Marketing} from "../assets/icon/coins-line.svg"
import {ReactComponent as Software} from "../assets/icon/code-box-fill.svg"
import {ReactComponent as Business} from "../assets/icon/briefcase-5-line.svg"
import {ReactComponent as Others} from "../assets/icon/more-fill.svg"

 export const TypeContext= createContext(1);
const Layout = (props) => {
    const [user, setUser] = useState(null)
    // const [type, setType] = useState();
    const [curType, setCurType] = useState(0);
    function handleGeneral() {
        setCurType(1);
        // navigate('/1');
        window.open("/1");
    }
    function handleAcademic() {
        setCurType(2);
        // navigate('/2');
    }
    function handleMarket() {
        setCurType(3);
        // navigate('/3');
    }
    function handleSoft() {
        setCurType(4);
        // navigate('/4');
    }
    function handleBusiness() {
        setCurType(5);
        // navigate('/5');
    }
    function handleOthers() {
        setCurType(6);
        // navigate('/6');
    }
    return (
        <div>
            <div className="tabbar">
                <div className="logo">
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
                        <span className="menu-item-text">Marketing</span>
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
            <div className="right-side">
                <div className="upper">
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <UserContext.Provider value={{ user, setUser }}>
                            <ConnectWallet />
                        </UserContext.Provider>
                    </div>
                </div>
                <AppRoutes />


            </div>
        </div>
    );
};

export default Layout;
