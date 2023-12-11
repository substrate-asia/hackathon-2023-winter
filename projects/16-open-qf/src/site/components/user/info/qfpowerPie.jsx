import { cn } from "@/utils";
import { PieChart } from "react-minimal-pie-chart";

export default function QFpowerPie({ className = "", percentage = 0 }) {
  const data = [
    {
      value: 100 - percentage,
      color: "var(--fill-bg-quaternary)",
    },
    {
      value: percentage,
      color: "var(--fill-bg-brand-secondary)",
    },
  ];

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
          {percentage?.toFixed(2)}
        </div>
        <div className="text14medium text-text-tertiary">QFpower</div>
      </div>
    </div>
  );
}
