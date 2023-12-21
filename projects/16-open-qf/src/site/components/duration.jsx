import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Duration({ time }) {
  const [fromNow, setFromNow] = useState("");

  useEffect(() => {
    setFromNow(dayjs(time).fromNow());
  }, [time]);

  return fromNow;
}
