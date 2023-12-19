import { Button } from "@osn/common-ui";
import Card from "@/components/card";
import React from "react";
import { cn } from "@/utils";

const SOCIAL_LINK_ITEMS = [
  {
    image: "/brand/x.svg",
    power: 10,
    title: "X/Twitter",
    description: "Verify your social media presence",
  },
  {
    image: "/brand/github.svg",
    power: 10,
    title: "GitHub",
    description: "Verify your code contributions",
  },
];

export default function UserTabQFpowerSocialLink() {
  return (
    <div>
      <h3 className="mb-5 text18semibold text-text-primary">Social Link</h3>

      <ul className="space-y-3">
        {SOCIAL_LINK_ITEMS.map((item) => (
          <Card key={item.title} size="small">
            <div className="space-y-5">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-fill-bg-quaternary">
                  <img src={item.image} alt="" />
                </div>
                <div className="text16semibold text-text-brand-secondary">
                  +{item.power}
                </div>
              </div>

              <div
                className={cn("flex justify-between gap-5", "max-sm:flex-col")}
              >
                <div className="space-y-1">
                  <h5 className="text16semibold text-text-primary">
                    {item.title}
                  </h5>
                  <p className="text14medium text-text-tertiary">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-end">
                  <Button>Connect</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
