'use client';

import { ProjectCard } from '@/components/cards/project-card';
import { projects } from '@/config/project';
import {
  getAvailableNFTs,
  getCollectionMetadata,
  getItemMetadata,
  getProjectDetails
} from '@/lib/queries';
import { shortenAddress } from '@/lib/utils';
import { Project } from '@/types';
import { useEffect, useState } from 'react';

export function Projects() {
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

  //   itemMetadata
  // :
  // data
  // :
  // "{\"cid\":\"QmfTTcyi8v5FbiuV4ZBhnPecQSP7AEsUYHz1opPRZgi8J9\",\"typeTotalNo\":5, \"typePrice\": 10

  // "{"projectName": "The Trees", "projectDescription": "Beautiful green trees", "projectLocation": "London", "projectCategory": "Environment"}"
  // const data: any = fetchMetadata();
  // console.log('projects', data);
  // console.log(JSON.parse(data.collectionMetadata.data).projectName);

  useEffect(() => {
    getProject();
  }, []);

  console.log({ project });

  return (
    <section className="grid grid-cols-4 gap-5">
      {isLoading ? <p>loading...</p> : <ProjectCard project={project && project} />}
      {/* ))} */}
    </section>
  );
}
