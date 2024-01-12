'use client';

import { LargeNftCard } from '@/components/cards/large-nft-card';
import { NftCard } from '@/components/cards/nft-card';
import { Icons } from '@/components/icons';
import { projects } from '@/config/project';
import {
  getCollectionMetadata,
  getItemMetadata,
  getAvailableNFTs,
  getProjectDetails,
  getCollection
} from '@/lib/queries';
import { shortenAddress } from '@/lib/utils';
import { ProjectDescription } from '@/sections/product/product-description';
import { Project, ProjectCategory } from '@/types';
import { Fragment, useEffect, useState } from 'react';

// const project: Project = {
//   id: 2,
//   title: 'Let’s plant one million tre...',
//   foundationName: 'GreenHaven',
//   image: '/images/projects/project-six.png',
//   category: 'environment',
//   price: '550000',
//   price_per_nft: 1000,
//   noOfNFTs: 100,
//   description: '',
//   currentBalance: '',
//   duration: ''
// };

export default function ProductPage({
  params: { projectId }
}: {
  params: { projectId: string };
}) {
  const [nfts, setNfts] = useState<
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
      | 'type'
    >[]
  >([
    {
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
      duration: '',
      type: 0
    }
  ]);

  // fix this
  const Icon = Icons['ecology'];

  const fetchMetadata = async (projectId: number) => {
    const collectionMetadata = await getCollectionMetadata(projectId);
    const availableNFTs = await getAvailableNFTs(projectId);
    const projectDetails = await getProjectDetails(projectId);
    const baseProjectDetails = await getCollection(projectId);

    return { collectionMetadata, availableNFTs, projectDetails, baseProjectDetails };
  };

  const getNFTData = async (projectId: number) => {
    try {
      const response: any = await fetchMetadata(projectId);

      const result = JSON.parse(response.collectionMetadata.data);
      const detail = response.projectDetails;
      const numberOfNFTs = response.baseProjectDetails.items;
      const nftData = result.nftMetadata;
      setNfts(
        nftData.map((nft: any, index: number) => {
          const nftParsed = JSON.parse(nft);
          return {
            id: projectId,
            image: `https://crustipfs.mobi/ipfs/${nftParsed.cid}`,
            title: result.projectName,
            price: nftParsed.typePrice.replaceAll(',', ''),
            noOfNFTs: nftParsed.typeTotalNo,
            type: index + 1
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNFTData(parseInt(projectId));
  }, []);

  return (
    <Fragment>
      <section className="grid grid-cols-1 gap-[33px] py-5 md:grid-cols-2">
        <div className="grid w-full grid-cols-1 gap-[33px] border-b border-foreground/[0.42] p-4 px-[100px] md:grid-cols-2 md:gap-[20px] lg:grid-cols-2 lg:gap-[33px]">
          {nfts &&
            nfts.map(nft => {
              if (nfts.length == 1) {
                return <LargeNftCard key={nft.type} project={nft} />;
              } else {
                return <NftCard key={nft.type} project={nft} />;
              }
            })}
        </div>
        <ProjectDescription
          id={projectId}
          category={{
            title: nfts[0].category,
            icon: <Icon className="h-[14px] w-[18px]" />
          }}
        />
      </section>
    </Fragment>
  );
}
