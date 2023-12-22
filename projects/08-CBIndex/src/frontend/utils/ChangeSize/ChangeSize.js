import React, { useState, useEffect, useCallback } from "react";

function ChangeSize() {
    if (typeof window !== "undefined") {
        const [size, setSize] = useState({
            width: document.documentElement.clientWidth,
            hieght: document.documentElement.clientHeight,
        });

        const onResize = useCallback(() => {
            setSize({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            });
        }, []);

        useEffect(() => {
            window.addEventListener("resize", onResize);
            return () => {
                window.removeEventListener("resize", onResize);
            };
        }, []);

        return size;
    }
}
export default ChangeSize;
