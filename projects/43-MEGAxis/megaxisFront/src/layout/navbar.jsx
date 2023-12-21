import React, {useState} from "react";
import {UserContext} from "../App";
import ConnectWallet from "../components/ConnectWallet/connectWallet";

const Navbar = () => {
    const [user, setUser] = useState(null)
    return (
        <div className="upper">
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <UserContext.Provider value={{ user, setUser }}>
                    <ConnectWallet />
                </UserContext.Provider>
            </div>
        </div>
    );
};

export default Navbar;