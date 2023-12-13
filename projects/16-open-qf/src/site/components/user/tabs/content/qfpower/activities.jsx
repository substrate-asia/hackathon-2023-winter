import Card from "@/components/card";
import { USER_QFPOWER_ACTIVITIES } from "@/fixtures/user";
import React from "react";

export default function UserTabQFpowerActivities() {
  return (
    <div>
      <h3 className="mb-5 text18semibold text-text-primary">
        On-chain Activities
      </h3>

      <ul className="space-y-3">
        {USER_QFPOWER_ACTIVITIES.map((item) => (
          <Card key={item.label} size="small">
            <div className="flex items-center justify-between text16semibold text-text-primary gap-x-5">
              <div className="line-clamp-1">{item.label}</div>
              <div className="text-text-brand-secondary">+{item.power}</div>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
