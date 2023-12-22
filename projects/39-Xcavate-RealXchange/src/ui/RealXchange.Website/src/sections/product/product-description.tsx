import {
  SectionDescription,
  SectionHeader,
  SectionTitle
} from '@/components/section-header';
import { BaseButton } from '@/components/ui/base-button';
import {
  getAvailableNFTs,
  getCollectionMetadata,
  getItemMetadata,
  getProjectDetails
} from '@/lib/queries';
import { shortenAddress } from '@/lib/utils';
import { Project } from '@/types';
import { useState } from 'react';

export interface ProjectDescriptionProps {
  category: {
    title: string;
    icon: any;
  };
}

export function ProjectDescription({ category }: ProjectDescriptionProps) {
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
    >
  >({
    title: '',
    id: '',
    category: 'environment',
    foundationName: '',
    description: '',
    price: '',
    noOfNFTs: 0,
    image: ''
  });

  const fetchMetadata = async () => {
    const collectionMetadata = await getCollectionMetadata(22);
    const itemMetadata = await getItemMetadata(22, 1);
    const availableNFTs = await getAvailableNFTs(22);
    const projectDetails = await getProjectDetails(22);

    return { collectionMetadata, itemMetadata, availableNFTs, projectDetails };
  };

  async function getProject() {
    try {
      setIsLoading(true);
      const response: any = await fetchMetadata();
      setIsLoading(false);
      console.log(response);

      const result = await JSON.parse(response.collectionMetadata.data);
      const image = await JSON.parse(response.itemMetadata.data);
      const detail = response.projectDetails;
      console.log({ result });
      const { data } = response.collectionMetadata;

      setProject({
        id: 22,
        title: result.projectName,
        category: 'environment',
        description: result.description,
        image: `https://crustipfs.mobi/ipfs/${image.cid}`,
        price: detail.projectPrice,
        foundationName: shortenAddress(detail.projectOwner),
        noOfNFTs: detail.nftTypes
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <aside className="flex flex-col gap-10 border-l border-foreground/[0.42] py-[43px] pl-[64px]">
      <SectionHeader>
        <SectionTitle>Lets Plant One Million Trees</SectionTitle>
        <div className="flex items-center space-x-2">
          <span className="text-[0.75rem] font-light text-[0.6]"> Created by:</span>
          <BaseButton className="text-[1rem]/[1.5rem] text-[#006EAE] underline-offset-4 hover:underline">
            @Trillion_Treesfoundation
          </BaseButton>
        </div>
        {/* Utility Data */}
        <div className="mt-6 space-y-4">
          <dl className="flex items-center gap-x-2 font-light">
            <dt className="text-[0.75rem] text-[0.6]">Project location:</dt>
            <dd className="text-[1rem]/[1.5rem]"></dd>
          </dl>
          <dl className="flex items-center gap-x-2 font-light">
            <dt className="text-[0.75rem] text-[0.6]">Category:</dt>
            <dd className="flex items-center gap-1 text-[1rem]/[1.5rem] capitalize">
              {category.icon} {category.title}
            </dd>
          </dl>
        </div>
      </SectionHeader>

      <SectionHeader>
        <SectionTitle size={'md'}>Description</SectionTitle>
        <SectionDescription>
          Deforestation in the Brazilian Amazon has jumped 22% in the latest 12-month
          period, reaching its highest level since 2006, data from the countrys space
          agency shows. Between August 2020 and July 2021, trees were felled from land
          measuring 13,235 square km (5,110 square miles), the National Institute for
          Space Research (INPE) said. It is an area 17 times the size of New York City.
        </SectionDescription>
      </SectionHeader>
    </aside>
  );
}
