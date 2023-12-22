/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { BaseButton } from '../ui/base-button';
import { Icons } from '../icons';
import { Project } from '@/types';
import { formatNumber, formatPrice } from '@/lib/utils';
import ModalContainer from '../ui/modal-container';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface NftCardProps {
  project: Project;
}

type BuyNowModalProps = {
  project: Project;
  open: boolean;
  close: () => void;
};

export function NftCard({ project }: NftCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="flex h-full w-full flex-col items-start gap-[13px] rounded-lg bg-background px-[6px] pb-[13px] pt-[7px] shadow-feature-card">
      <div className="w-full space-y-3.5">
        <div className="relative">
          {/* <Image
            src={project.image}
            alt={project.title}
            width={503}
            height={504}
            priority
          /> */}
          <img src={project.image} alt={project.title} className="h-[180px] w-[239px]" />
          {/* buy now button */}
          <BaseButton
            className="absolute bottom-4 right-[80px] flex w-[88px] items-center justify-center gap-2 rounded-[17px] border border-background bg-primary/50 px-2 py-[6px] text-[0.75rem] font-light text-primary-light hover:bg-primary/60"
            onClick={openModal}
          >
            Buy now
          </BaseButton>
        </div>
      </div>

      <div className="flex w-full justify-between text-[0.6rem] font-light">
        <dl>
          <dt className="text-foreground/[0.6]">Price</dt>
          <dd>{formatPrice(project.price, { currency: 'USD' })}</dd>
        </dl>
        <dl>
          <dt className="text-foreground/[0.6]">NFTs</dt>
          <dd>{formatNumber(project.noOfNFTs)}</dd>
        </dl>
      </div>
      <BuyNowModal project={project} open={isOpen} close={closeModal} />
    </div>
  );
}

const BuyNowModal = ({ project, open, close }: BuyNowModalProps) => {
  const closeModalRef = useRef(null);

  const [value, setValue] = useState<number>(1);

  const incrementValue = () => {
    if (value == project.noOfNFTs) {
      return toast.error('You have reached available maximum unit purchase');
    }
    setValue(prev => prev + 1);
  };
  const decrementValue = () => {
    if (value === 1) return;
    setValue(prev => prev - 1);
  };

  return (
    <ModalContainer
      title={'Summary'}
      openModal={open}
      closeModal={close}
      ref={closeModalRef}
    >
      <section className="flex w-full flex-col gap-[36px]">
        <div className="flex items-center gap-6 border-b border-foreground pb-[36px]">
          <Image
            src={project.image}
            alt={project.title}
            width={136}
            height={89}
            className="rounded-[6px]"
          />

          <ul className="flex flex-col gap-2 text-[0/75rem]/[1.5rem]">
            <li className="font-light ">
              By{' '}
              <BaseButton className="text-accent">@{project.foundationName}</BaseButton>
            </li>
            <li>{project.title}</li>
            <li>#56 of 100 NFTs Minted</li>
          </ul>
        </div>
        <div className="flex items-center justify-between px-[80px]">
          <BaseButton onClick={incrementValue}>
            <Icons.addSquare className="h-8 w-8 fill-foreground" />
          </BaseButton>
          <span className="text-[1rem]/[1.5rem] font-semibold">{value}</span>
          <BaseButton onClick={decrementValue}>
            <Icons.removeSquare className="h-8 w-8 fill-foreground" />
          </BaseButton>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <dl className="flex w-full items-center justify-between text-[1rem]/[1.5rem]">
            <dt>To pay</dt>
            <dd>{formatPrice(value * (project?.price_per_nft || 0))}</dd>
          </dl>
          <p className="text-[0.75rem]/[1.5rem] font-light">
            Price for 1 NFT = {formatPrice(project?.price_per_nft || 0)}
          </p>
        </div>
        <Button variant="primary" fullWidth>
          Make payment
        </Button>
      </section>
    </ModalContainer>
  );
};
