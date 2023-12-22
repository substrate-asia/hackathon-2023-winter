import React from "react";
import { Link } from "react-router-dom";

const PromptNFT = () => {
    return (
        <div>
            <h1>PromptNFT Page</h1>
            <Link to="/">Go to PlusGPT</Link>
            <br />
            <Link to="/tools-store">Go to ToolsStore</Link>
            {/* 这里是 PromptNFT 页面的内容 */}
        </div>
    );
};

export default PromptNFT;
