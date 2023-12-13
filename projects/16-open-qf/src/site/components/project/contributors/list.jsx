import NetworkUser from "@/components/user/networkUser";
import { useServerSideProps } from "@/context/serverSideProps";
import { toPrecision } from "@osn/common";
import dayjs from "dayjs";
import BorderRow from "../borderRow";

export default function ContributionsList() {
  const { detail } = useServerSideProps();
  const contributors = detail?.contributors || [];

  if (!contributors.length) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {contributors.map((item, index) => {
        const amount = toPrecision(item.amount, 10);
        return (
          <BorderRow key={index}>
            <div className="flex grow">
              <NetworkUser address={item.address} network="polkadot" />
            </div>
            <div className="flex justify-center grow">
              {dayjs(item.timestamp).format("YYYY-MM-DD")}
            </div>
            <div className="flex justify-end grow">{amount} DOT</div>
          </BorderRow>
        );
      })}
    </div>
  );
}
