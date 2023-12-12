import { useServerSideProps } from "@/context/serverSideProps";
import CardTitle from "../title";
import ContributionsList from "./list";

export default function Contributions() {
  const { detail } = useServerSideProps();
  const count = detail?.contributors?.length || 0;

  return (
    <div className="flex flex-col p-[32px] shadow-shadow-card-default">
      <CardTitle title="Contributors" count={count} />
      <ContributionsList />
    </div>
  );
}
