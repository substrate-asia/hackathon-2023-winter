import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

export default function QFpowerPie({
  className = "",
  allScore = 0,
  userScore = 0,
}) {
  const percentage = (userScore / allScore) * 100;

  const [data, setData] = useState([]);
  useEffect(() => {
    setData([
      // all
      {
        value: 100 - percentage,
        color: "var(--fill-bg-quaternary)",
      },
      // user
      {
        value: percentage,
        color: "var(--fill-bg-brand-secondary)",
      },
    ]);
  }, [percentage]);

  return (
    <div className={cn("relative", className)}>
      <div className="w-full overflow-hidden">
        <PieChart
          // mirrored
          className={"scale-x-[-1]"}
          center={[50, 50]}
          rounded
          lineWidth={15}
          data={data}
          startAngle={-180}
          lengthAngle={180}
        />
      </div>

      <div className="text-center space-y-1 absolute bottom-4 w-full">
        <div className="text-text-primary text24bold">
          {userScore?.toFixed(2)}
        </div>
        <div className="text14medium text-text-tertiary">QFpower</div>
      </div>
    </div>
  );
}
