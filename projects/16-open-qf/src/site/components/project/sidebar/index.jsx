import { cn } from "@/utils";
import Contribution from "./contribution";
import MatchingFunds from "./matchingFunds";

export default function Sidebar({ className }) {
  return (
    <div className={cn("flex flex-col gap-[20px]", className)}>
      <Contribution />
      <MatchingFunds />
    </div>
  );
}
