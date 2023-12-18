import Contribution from "./contribution";
import MatchingFunds from "./matchingFunds";

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-[20px]">
      <Contribution />
      <MatchingFunds />
    </div>
  );
}
