'use client';

import { LargeNftCard } from '@/components/cards/large-nft-card';
import { NftCard } from '@/components/cards/nft-card';
import { Icons } from '@/components/icons';
import { ProjectDescription } from '@/sections/product/product-description';
import { Project, ProjectCategory } from '@/types';
import { Fragment } from 'react';

const project: Project = {
  id: 2,
  title: 'Let’s plant one million tre...',
  foundationName: 'GreenHaven',
  image: '/images/projects/project-six.png',
  category: 'environment',
  price: '550000',
  price_per_nft: 1000,
  noOfNFTs: 100,
  description: ''
};

export default function ProductPage({
  params: { projectId }
}: {
  params: { projectId: string };
}) {
  const Icon = Icons[project.category ?? ''];
  return (
    <Fragment>
      <section className="flex w-full flex-col gap-[33px] border-b border-foreground/[0.42] px-[100px] md:flex-row">
        {projectId === '1' ? (
          <LargeNftCard project={project} />
        ) : (
          <div className="my-[53px] grid w-[600px] grid-cols-2 gap-[18px]">
            <NftCard project={project} />
            <NftCard project={project} />
            <NftCard project={project} />
            <NftCard project={project} />
          </div>
        )}

        <ProjectDescription
          category={{
            title: project.category,
            icon: <Icon className="h-[14px] w-[18px]" />
          }}
        />
      </section>
    </Fragment>
  );
}
