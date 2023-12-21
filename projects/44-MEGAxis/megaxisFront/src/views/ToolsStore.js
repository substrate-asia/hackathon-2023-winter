import React from "react";
import { Link } from "react-router-dom";

const ToolsStore = () => {
    return (
        <div>
            <h1>ToolsStore Page</h1>
            <Link to="/">Go to PlusGPT</Link>
            <br />
            <Link to="/prompt-nft">Go to PromptNFT</Link>
            {/* 这里是 ToolsStore 页面的内容 */}
        </div>
    );
};

export default ToolsStore;
