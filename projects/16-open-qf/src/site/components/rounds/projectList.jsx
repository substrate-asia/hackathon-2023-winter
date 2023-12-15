import Card from "../card";
import { Input } from "@osn/common-ui";
import { SystemSearch } from "@osn/icons/opensquare";
import Tag from "../tag";
import { cn } from "@/utils";
import { useState } from "react";
import Dot from "../dot";
import NoData from "../noData";
import ProjectCard from "../card/project";

export default function RoundProjectList({
  categories: categoriesProp = [],
  projects = [],
}) {
  const categories = [
    { label: "All", value: "" },
    ...categoriesProp.map((item) => ({
      label: item,
      value: item,
    })),
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0].value);
  const [searchInput, setSearchInput] = useState("");

  const filteredProjects = projects
    .filter((project) =>
      activeCategory ? project.category === activeCategory : true,
    )
    .filter((project) =>
      project.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

  return (
    <div className="space-y-5">
      <Card size="small">
        <div className={cn("flex justify-between gap-5", "max-sm:flex-col")}>
          <div className="flex items-center flex-wrap gap-3">
            {categories.map((item) => (
              <Tag
                key={item.label}
                active={item.value === activeCategory}
                onClick={() => setActiveCategory(item.value)}
              >
                {item.label}
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

        {filteredProjects.length ? (
          <ProjectsList projects={filteredProjects} />
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

function ProjectsList({ projects = [] }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-5",
        "max-md:grid-cols-2",
        "max-sm:grid-cols-1",
      )}
    >
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
