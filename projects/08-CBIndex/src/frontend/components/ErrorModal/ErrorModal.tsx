import React from "react";
import { Modal } from "antd";
const ErrorModal = ({ setErrorModal, errorModal, errrorMessage }: any) => {
    return <>
        <Modal
            onOk={() => setErrorModal(false)}
            open={errorModal}
            closeIcon={false}
            cancelButtonProps={{
                style: {
                    display: "none"
                }

            }} >
            <span style={{
                fontWeight: "bold",
                color: "red"
            }}>
                Error
            </span>: {errrorMessage.shortMessage}
        </Modal >
    </>
}
export default ErrorModal