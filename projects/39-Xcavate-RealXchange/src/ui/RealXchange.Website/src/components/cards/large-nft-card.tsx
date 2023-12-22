/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { BaseButton } from '../ui/base-button';
import { Project } from '@/types';
import { formatNumber, formatPrice } from '@/lib/utils';

interface LargeNftCardProps {
  project: Project;
}

export function LargeNftCard({ project }: LargeNftCardProps) {
  return (
    <div className="my-[43px] inline-flex h-full w-[503px] flex-col items-start gap-7 rounded-lg bg-background px-3.5 pb-7 pt-3.5 shadow-feature-card">
      <div className="w-full space-y-7">
        <div className="relative">
          {/* <Image
            src={project.image}
            alt={project.title}
            width={502}
            height={378}
            priority
          /> */}
          <img src={project.image} alt={project.title} className="h-[378px] w-[502px]" />
          <BaseButton className="absolute bottom-10 right-[159px] flex w-[183px] items-center justify-center gap-2 rounded-[36px] border border-background bg-primary/50 px-3.5 py-[11px] text-[1.35125rem] font-light text-primary-light">
            Buy now
          </BaseButton>
        </div>
      </div>

      <div className="flex w-full justify-between text-[1.4rem] font-light">
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
