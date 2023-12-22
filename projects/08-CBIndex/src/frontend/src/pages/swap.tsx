import React from "react";
import dynamic from "next/dynamic";
const SwapPage = dynamic(() => import("../../containers/SwapPage/SwapPage"), { ssr: false });
// import SwapPage from "../../containers/SwapPage/SwapPage";

const Swap = () => {


    return <>
        <SwapPage />
    </>
}
export default Swap;