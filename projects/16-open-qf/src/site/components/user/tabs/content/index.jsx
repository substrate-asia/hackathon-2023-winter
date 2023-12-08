import { useSearchParams } from "next/navigation";
import UserTabQFpowerContent from "./qfpower";
import UserTabContributionsContent from "./contributions";
import UserTabProjectsContent from "./projects";

export default function UserTabsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "qfpower";

  return (
    <>
      {activeTab === "qfpower" && <UserTabQFpowerContent />}
      {activeTab === "contributions" && <UserTabContributionsContent />}
      {activeTab === "projects" && <UserTabProjectsContent />}
    </>
  );
}
