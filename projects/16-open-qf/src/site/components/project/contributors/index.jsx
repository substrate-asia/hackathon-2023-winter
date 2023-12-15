import { useServerSideProps } from "@/context/serverSideProps";
import CardTitle from "../title";
import ContributionsList from "./list";

export default function Contributions() {
  const { contributors } = useServerSideProps();
  const count = contributors?.total || 0;

  if (!count) {
    return null;
  }

  return (
    <div className="flex flex-col p-[32px] shadow-shadow-card-default">
      <CardTitle title="Contributors" count={count} />
      <ContributionsList />
    </div>
  );
}
