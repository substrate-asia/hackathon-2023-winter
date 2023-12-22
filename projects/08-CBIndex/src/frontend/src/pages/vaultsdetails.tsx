import React from "react";
// import DetailsPage from '../../containers/DetailsPage/DetailsPage'
import dynamic from "next/dynamic";
const DetailsPage = dynamic(() => import("../../containers/DetailsPage/DetailsPage"), {
    ssr: false,
});
const details = () => {

    return <>
        <DetailsPage />
    </>
}

export default details;