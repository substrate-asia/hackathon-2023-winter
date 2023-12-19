import LocaleSymbol from "@/components/common/localeSymbol";
import { useServerSideProps } from "@/context/serverSideProps";
import { cn } from "@/utils";
import SvgSystemReward from "@osn/icons/opensquare/SystemReward";
import { PieChart } from "react-minimal-pie-chart";

function Chart({ percentage }) {
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
    <div className="flex justify-center grow">
      <div className="w-[140px] h-[140px] relative">
        <PieChart
          center={[50, 50]}
          rounded
          lineWidth={15}
          data={data}
          startAngle={-90}
          lengthAngle={-360}
        />
        <span
          className={cn(
            "absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
            "text20semibold text-text-primary",
          )}
        >
          {(percentage || 0)?.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function Item({ title, value }) {
  return (
    <div className="flex flex-col gap-[4px] items-center grow">
      <span className="text14medium text-text-tertiary">{title}</span>
      <span className="text16semibold text-text-primary">{value}</span>
    </div>
  );
}

export default function MatchingFunds() {
  const { round, detail } = useServerSideProps();
  const poll = round?.asset?.amount || 0;
  const matched = detail?.matched || 0;

  const percentage = (matched / poll) * 100;

  return (
    <div className="flex flex-col w-full p-[32px] shadow-shadow-card-default gap-[24px]">
      <div className="flex items-center justify-between pb-[16px] border-b border-stroke-border-default">
        <span className="text-text-primary text16semibold">Matching Funds</span>
        <SvgSystemReward className="[&_path]:fill-text-tertiary" />
      </div>
      <div className="flex flex-col gap-[16px]">
        <Chart percentage={percentage} />
        <div className="flex gap-[16px] justify-between">
          <Item title="Matching Pool" value={<LocaleSymbol value={poll} />} />
          <Item
            title="Matching Funds"
            value={<LocaleSymbol value={matched} />}
          />
        </div>
      </div>
    </div>
  );
}
