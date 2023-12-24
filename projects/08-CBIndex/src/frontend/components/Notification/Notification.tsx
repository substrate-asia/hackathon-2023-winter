import React, { useEffect, useImperativeHandle } from "react";
import { notification } from "antd";
const Notification = ({ onRef }: any) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (obj: any) => {
        api.info(obj);
    };
    useImperativeHandle(onRef, () => {
        return {
            openNotification,
        };
    });
    return <>{contextHolder}</>;
};
export default Notification;
