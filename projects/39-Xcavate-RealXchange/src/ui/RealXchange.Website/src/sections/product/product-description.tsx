import { Icons } from '@/components/icons';
import {
  SectionDescription,
  SectionHeader,
  SectionTitle
} from '@/components/section-header';
import { BaseButton } from '@/components/ui/base-button';
import { Button } from '@/components/ui/button';
import {
  getAvailableNFTs,
  getCollectionMetadata,
  getItemMetadata,
  getProjectDetails
} from '@/lib/queries';
import { shortenAddress } from '@/lib/utils';
import { Project } from '@/types';
import { useEffect, useState } from 'react';

export interface ProjectDescriptionProps {
  id: any;
  category: {
    title: string;
    icon: any;
  };
}

export function ProjectDescription({ id, category }: ProjectDescriptionProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [project, setProject] = useState<
    Pick<
      Project,
      | 'title'
      | 'id'
      | 'category'
      | 'foundationName'
      | 'description'
      | 'price'
      | 'noOfNFTs'
      | 'image'
      | 'location'
      | 'currentBalance'
      | 'duration'
    >
  >({
    title: '',
    id: '',
    category: 'environment',
    foundationName: '',
    description: '',
    price: '',
    noOfNFTs: 0,
    image: '',
    location: '',
    currentBalance: '',
    duration: ''
  });

  const fetchMetadata = async (projectId: number) => {
    const collectionMetadata = await getCollectionMetadata(projectId);
    const itemMetadata = await getItemMetadata(projectId, 1);
    const availableNFTs = await getAvailableNFTs(projectId);
    const projectDetails = await getProjectDetails(projectId);

    return { collectionMetadata, itemMetadata, availableNFTs, projectDetails };
  };

  async function getProject() {
    try {
      setIsLoading(true);
      const response: any = await fetchMetadata(id);
      setIsLoading(false);

      const result = await JSON.parse(response.collectionMetadata.data);
      const image = await JSON.parse(response.itemMetadata.data);
      const detail = response.projectDetails;
      const { data } = response.collectionMetadata;

      setProject({
        id: id,
        title: result.projectName,
        category: result.projectCategory,
        description: result.projectDescription,
        location: result.projectLocation,
        image: `https://crustipfs.mobi/ipfs/${image.cid}`,
        price: detail.projectPrice,
        foundationName: shortenAddress(detail.projectOwner),
        noOfNFTs: detail.nftTypes,
        currentBalance: detail.projectBalance,
        duration: detail.duration
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProject();
  }, []);

  const Icon = Icons[project.category ?? ''];

  return (
    <aside className="flex flex-col gap-10 border-l border-foreground/[0.42] py-[43px] pl-[64px]">
      <SectionHeader>
        <SectionTitle>{project.title}</SectionTitle>
        <div className="flex items-center space-x-2">
          <span className="text-[0.75rem] font-light text-[0.6]"> Created by:</span>
          <BaseButton className="text-[1rem]/[1.5rem] text-[#006EAE] underline-offset-4 hover:underline">
            @{project.foundationName}
          </BaseButton>
        </div>
        {/* Utility Data */}
        <div className="mt-6 space-y-4">
          <dl className="flex items-center gap-x-2 font-light">
            <dt className="text-[0.75rem] text-[0.6]">Project location:</dt>
            <dd className="text-[1rem]/[1.5rem]">{project.location}</dd>
          </dl>
          <dl className="flex items-center gap-x-2 font-light">
            <dt className="text-[0.75rem] text-[0.6]">Category:</dt>
            <dd className="flex items-center gap-1 text-[1rem]/[1.5rem] capitalize">
              <Icon className="h-[14px] w-[18px]" /> {project.category}
            </dd>
          </dl>
        </div>
      </SectionHeader>

      <SectionHeader>
        <SectionTitle size={'md'}>Description</SectionTitle>
        <SectionDescription>{project.description}</SectionDescription>
      </SectionHeader>

      <SectionHeader>
        <SectionTitle size={'md'}>Funding Target</SectionTitle>

        <div className="flex gap-4">
          <TargetItem title="Target:" value={project.price} />
          <TargetItem title="Raised:" value={project.currentBalance} />
          <TargetItem title="Project Duration" value={`${project.duration} months`} />
        </div>
      </SectionHeader>

      <Button href={`/project/${id}/activity`} variant={'primary'}>
        View project activity
      </Button>
    </aside>
  );
}

const TargetItem = ({ title, value }: { title: string; value: string }) => (
  <div className="flex items-center gap-2 font-light">
    <dt className="text-[0.75rem]/[1.5rem] text-foreground/80">{title}</dt>
    <dd className="text-[1rem]">{value}</dd>
  </div>
);
