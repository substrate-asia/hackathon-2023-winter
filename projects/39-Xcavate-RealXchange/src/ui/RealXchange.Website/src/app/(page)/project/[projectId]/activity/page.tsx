// 'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { fetchMetadata } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { title } from 'process';

export default async function PageActivity({
  params: { projectId }
}: {
  params: { projectId: number };
}) {
  // const router = useRouter();

  const data: any = await fetchMetadata(projectId);
  const project = JSON.parse(data.collectionMetadata.data);

  return (
    <section className="container flex w-full flex-col items-start gap-10 px-[100px] py-10">
      <Button href={`/project/${projectId}`} variant="plain" size="text">
        <Icons.back className="h-6 w-6" /> Back
      </Button>

      <div className="flex flex-col justify-start gap-5">
        <h1 className="text-[1.5rem]/[1.5rem] font-bold">Project activity</h1>

        <div className="flex w-full flex-col items-start gap-4">
          <ActivityDescriptionItem title="Project name:" value={project.projectName} />
          <ActivityDescriptionItem
            title="Project goal:"
            value={project.projectDescription}
          />
          {/* <ActivityDescriptionItem
            title="Project completion target:"
            value="1,000,000 trees"
          />
          <ActivityDescriptionItem title="Total trees planted:" value="5,000" /> */}
        </div>
      </div>

      <div className="grid w-full grid-cols-5 gap-[21px]">
        <ActivityOverviewItem
          label="Raised/Total"
          value={`$${data.projectDetails.projectBalance} of $${data.projectDetails.projectPrice}`}
        />
        <ActivityOverviewItem label="Milestones" value={data.projectDetails.milestones} />
        <ActivityOverviewItem
          label="Remaining"
          value={data.projectDetails.remainingMilestones}
        />
        {/* <ActivityOverviewItem label="Amount paid" value={data.projectDetails.} /> */}
        <ActivityOverviewItem
          label="Amount locked"
          value={`$${data.projectDetails.projectBondingBalance}`}
        />
      </div>
    </section>
  );
}

const ActivityDescriptionItem = ({ title, value }: { title: string; value: string }) => (
  <dl className="flex items-start gap-2 text-[1rem]/[1.5rem]">
    <dt>{title}</dt>
    <dd className="font-light">{value}</dd>
  </dl>
);

const ActivityOverviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="inline-flex h-[174px] w-[229px] flex-col items-center gap-6 rounded-lg border-foreground/[0.42] py-[51px] text-[1rem]/[1.5rem] font-normal shadow-activity">
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);
