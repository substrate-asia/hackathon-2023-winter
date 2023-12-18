import Card from ".";
import Tag from "../tag";
import { cn } from "@/utils";
import IpfsImage from "../image/ipfs";
import Link from "next/link";
import NetworkUser from "../user/networkUser";
import LocaleSymbol from "@/components/common/localeSymbol";

function Logo({ project }) {
  return (
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
  );
}

function Description({ project }) {
  return (
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
  );
}

function TotalRaised({ project }) {
  return (
    <div className="mt-5 space-y-1">
      <div className="text14medium text-text-tertiary">Total Raised</div>
      <div className="text16semibold text-text-primary">
        <LocaleSymbol value={project.raised || 0}/>
      </div>
      <div className="text12medium text-text-tertiary">
        from{" "}
        <span className="text-text-primary">
          {project.contributorsCount || 0}
        </span>{" "}
        Contributors
      </div>
    </div>
  );
}

function Footer({ project }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <NetworkUser address={project.creator} network={"polkadot"} />
      </div>
      <div>
        <Tag size="small">{project.category}</Tag>
      </div>
    </div>
  );
}

function CardBase({ className, project, children }) {
  return (
    <Card
      className={className}
      key={project.id}
      cover={<IpfsImage cid={project.bannerCid} className="object-cover" />}
      coverPosition="top"
      size="small"
      head={
        <div className="flex flex-col flex-1">
          <Logo project={project} />
          <Description project={project} />
          {children}
        </div>
      }
    >
      <Footer project={project} />
    </Card>
  );
}

export function SimpleProjectCard({ project }) {
  return <CardBase className="!shadow-none" project={project} />;
}

export default function ProjectCard({ project }) {
  return (
    <CardBase project={project}>
      <TotalRaised project={project} />
    </CardBase>
  );
}
