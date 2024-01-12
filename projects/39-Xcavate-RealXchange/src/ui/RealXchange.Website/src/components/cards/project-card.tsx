/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import { BaseButton } from '../ui/base-button';
import { Icons } from '../icons';
import { Project, ProjectCategory } from '@/types';
import { formatNumber, formatPrice } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = Icons[project.category];

  return (
    <div className="group flex h-[352px] w-[295px] flex-col items-start gap-4 rounded-lg bg-[#F3F3F3] px-2 pb-4 pt-2 shadow-feature-card">
      <Link href={`/project/${project.id}`} className="w-full space-y-3.5">
        <div className="relative">
          {/* <Image
            src={project.image}
            alt={project.title}
            width={279}
            height={210}
            priority
          /> */}

          <img
            src={project.image}
            alt={project.title}
            className="h-[210px] w-[279px] bg-foreground/50 brightness-50 transition-all duration-500 group-hover:brightness-100"
          />
          <div className=" absolute bottom-4 right-4 flex items-center justify-center gap-2 rounded-[20px] bg-background/[0.24] px-2 py-[6px] text-[0.75rem] font-light text-primary-light/[0.64] backdrop-blur-[2px] backdrop-filter">
            {project.category}
          </div>
        </div>

        <div className="flex w-full items-start justify-between gap-[13px] border-b pb-2.5">
          <div className="flex w-[225px] flex-col items-start gap-2">
            <h3 className="text-wrap max-w-[225px] truncate text-[0.875rem] font-medium">
              {project.title}
            </h3>
            <BaseButton className="text-[0.75rem] font-light underline-offset-4 hover:underline">
              @{project.foundationName}
            </BaseButton>
          </div>
          <Icon className="h-[14px] w-[18px]" />
        </div>
      </Link>

      <div className="flex w-full justify-between text-[0.75rem] font-light">
        <dl>
          <dt className="text-foreground/[0.6]">Price</dt>
          <dd>{formatPrice(project.price, { currency: 'USD' })}</dd>
        </dl>
        <dl>
          <dt className="text-foreground/[0.6]">NFTs</dt>
          <dd>{formatNumber(project.noOfNFTs)}</dd>
        </dl>
      </div>
    </div>
  );
}
