import Card from "@/components/card";
import UserTabQFpowerActivities from "./activities";
import UserTabQFpowerSocialLink from "./socialLink";
import { cn } from "@/utils";

export default function UserTabQFpowerContent() {
  return (
    <div className="space-y-5">
      <Card className="space-y-1" hoverable={false}>
        <div className="text20semibold text-text-primary">What is QFpower</div>
        <div className="text14medium text-text-tertiary">
          QFpower is a score calculated by OpenQF based on on-chain activities
          and social link authentication.
        </div>
      </Card>

      <div className={cn("grid grid-cols-2 gap-5", "max-sm:grid-cols-1")}>
        <UserTabQFpowerActivities />
        <UserTabQFpowerSocialLink />
      </div>
    </div>
  );
}
