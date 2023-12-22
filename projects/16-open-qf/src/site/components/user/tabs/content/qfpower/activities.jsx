import Card from "@/components/card";
import { useServerSideProps } from "@/context/serverSideProps";
import { differenceBy } from "lodash-es";
import React from "react";

export default function UserTabQFpowerActivities() {
  const { activityTags, userActivityTags } = useServerSideProps();
  const restTags = differenceBy(activityTags, userActivityTags, "id");

  const restUserActivityTags = restTags.map((item) => ({ ...item, power: 0 }));

  return (
    <div>
      <h3 className="mb-5 text18semibold text-text-primary">
        On-chain Activities
      </h3>

      <ActivityList
        data={[...userActivityTags, ...restUserActivityTags].filter(
          (tag) => tag.type === "On-chain Activities",
        )}
      />
    </div>
  );
}

function ActivityList({ data = [] }) {
  return (
    <ul className="space-y-3">
      {data.map((item) => (
        <Card key={item.id} size="small">
          <div className="flex items-center justify-between text16semibold text-text-primary gap-x-5">
            <div className="line-clamp-1">{item.name}</div>
            <div className="text-text-brand-secondary">
              {item.power ? `+${item.power}` : 0}
            </div>
          </div>
        </Card>
      ))}
    </ul>
  );
}
