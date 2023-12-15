import Card from ".";
import Tag from "../tag";
import { cn } from "@/utils";
import IpfsImage from "../image/ipfs";
import Link from "next/link";
import NetworkUser from "../user/networkUser";

export default function ProjectCard({ project }) {
  return (
    <Card
      key={project.id}
      cover={<IpfsImage cid={project.bannerCid} className="object-cover" />}
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
            <div className="text14medium text-text-tertiary">Total Raised</div>
            <div className="text16semibold text-text-primary">123 DOT</div>
            <div className="text12medium text-text-tertiary">
              from{" "}
              <span className="text-text-primary">
                {project.contributorsCount || 0}
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
  );
}
