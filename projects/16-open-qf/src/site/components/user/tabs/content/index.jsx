import UserTabQFpowerContent from "./qfpower";
import UserTabContributionsContent from "./contributions";
import UserTabProjectsContent from "./projects";
import { useUserTab } from "@/hooks/useUserTab";

export default function UserTabsContent() {
  const [tab] = useUserTab();

  return (
    <>
      {tab === "qfpower" && <UserTabQFpowerContent />}
      {tab === "contributions" && <UserTabContributionsContent />}
      {tab === "projects" && <UserTabProjectsContent />}
    </>
  );
}
