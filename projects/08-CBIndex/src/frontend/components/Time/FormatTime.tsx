import React from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
/**
 * 
 * @description props time(时间戳), show(是否需要时分秒，默认开启)
 * @returns 格式化后的时间
 */
const FormatTime = (props: any) => {
    const { time, show = true } = props;
    const router = useRouter();
    if (show) {
        return (
            <>
                <div>
                    {time === "-"
                        ? "-"
                        : dayjs(time)
                            .locale("en")
                            .format("D MMMM YYYY, HH:mm:ss")
                    }
                </div>
            </>
        );
    } else {
        return (
            <>
                <div>
                    {time === "-"
                        ? "-"
                        : dayjs(time)
                            .locale("en")
                            .format("D MMMM YYYY")
                    }
                </div>
            </>
        );
    }

};
export default FormatTime;
