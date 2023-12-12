import Card from "../card";
import { Input } from "@osn/common-ui";
import { SystemSearch } from "@osn/icons/opensquare";
import Tag from "../tag";
import { cn } from "@/utils";
import { useState } from "react";
import Dot from "../dot";
import IpfsImage from "../image/ipfs";
import Link from "next/link";
import NetworkUser from "../user/networkUser";

const tagList = [
  {
    label: "All",
  },
  {
    label: "Infrastructure",
  },
  {
    label: "Community",
  },
  {
    label: "Education",
  },
];

export default function RoundProjectList({ projects = [] }) {
  const [activeTag, setActiveTag] = useState(tagList[0].label);
  const [searchInput, setSearchInput] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <Card size="small">
        <div className={cn("flex justify-between gap-5", "max-sm:flex-col")}>
          <div className="flex items-center flex-wrap gap-3">
            {tagList.map((tag) => (
              <Tag
                key={tag.label}
                active={tag.label === activeTag}
                onClick={() => setActiveTag(tag.label)}
              >
                {tag.label}
              </Tag>
            ))}
          </div>
          <div className="w-[344px] max-w-full">
            <Input
              placeholder="Search for project"
              suffix={
                <SystemSearch className="w-5 h-5 [&_path]:fill-text-tertiary" />
              }
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        <h3 className="text18semibold text-text-primary">
          Leaderboard <Dot className="mx-1" />
          <span className="text-text-tertiary">{projects.length}</span>
        </h3>

        <div
          className={cn(
            "grid grid-cols-3 gap-5",
            "max-md:grid-cols-2",
            "max-sm:grid-cols-1",
          )}
        >
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              cover={
                <IpfsImage cid={project.bannerCid} className="object-cover" />
              }
              coverPosition="top"
              size="small"
              head={
                <div className="flex flex-col flex-1">
                  <div className="h-6">
                    <div
                      className={cn(
                        "relative -top-14",
                        "bg-neutral-200",
                        "w-16 h-16 rounded-full border-2 border-stroke-border-default",
                        "overflow-hidden",
                      )}
                    >
                      <IpfsImage cid={project.logoCid} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text16semibold text-text-primary truncate">
                      <Link
                        href={`/rounds/${project.roundId}/projects/${project.id}`}
                        className="hover:underline hover:text-inherit"
                      >
                        {project.name}
                      </Link>
                    </h4>
                    <p className="mt-2 text14medium text-text-secondary line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-5 space-y-1">
                    <div className="text14medium text-text-tertiary">
                      Total Raised
                    </div>
                    <div className="text16semibold text-text-primary">
                      123 DOT
                    </div>
                    <div className="text12medium text-text-tertiary">
                      from{" "}
                      <span className="text-text-primary">
                        {project.contributors?.length || 0}
                      </span>{" "}
                      Contributors
                    </div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <NetworkUser address={project.creator} network={"polkadot"} />
                </div>
                <div>
                  <Tag size="small">{project.category}</Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
