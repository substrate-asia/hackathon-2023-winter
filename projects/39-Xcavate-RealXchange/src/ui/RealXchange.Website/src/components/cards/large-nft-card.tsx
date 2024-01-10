/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { BaseButton } from '../ui/base-button';
import { Project } from '@/types';
import { formatNumber, formatPrice, shortenAddress } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ModalContainer from '../ui/modal-container';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import ConnectPolkadotWallet from '../layouts/connect-polkadot-wallet';
import { Icons } from '../icons';
import { buyNft } from '@/lib/extrinsics';
import SubstrateContextProvider, { useSubstrateContext } from '@/context/polkadot-contex';
import { getAvailableNFTsbyType } from '@/lib/queries';

interface LargeNftCardProps {
  project: Project;
}

type BuyNowModalProps = {
  project: Project;
  open: boolean;
  close: () => void;
  availableNFTs: number[];
};

export function LargeNftCard({ project }: LargeNftCardProps) {
  const projectId = usePathname().split('/')[2];
  const [isOpen, setIsOpen] = useState(false);
  const [availableNFTs, setAvailableNFTS] = useState<number[]>([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const makePaymentRequest = async () => {
    const availableNFTs = (await getAvailableNFTsbyType(
      parseInt(projectId),
      project.type!
    )) as Array<number>;

    setAvailableNFTS(availableNFTs);
    openModal();
  };
  return (
    <SubstrateContextProvider>
      <div className="my-auto inline-flex h-full w-[503px] flex-col items-start gap-7 rounded-lg bg-background px-3.5 pb-7 pt-3.5 shadow-feature-card">
        <div className="w-full space-y-7">
          <div className="relative">
            {/* <Image
            src={project.image}
            alt={project.title}
            width={502}
            height={378}
            priority
          /> */}
            <img
              src={project.image}
              alt={project.title}
              className="h-[378px] w-[502px] bg-foreground/50 brightness-75"
            />
            <BaseButton
              className="absolute bottom-10 right-[159px] flex w-[183px] items-center justify-center gap-2 rounded-[36px] border border-background bg-primary/50 px-3.5 py-[11px] text-[1.35125rem] font-light text-primary-light"
              onClick={makePaymentRequest}
            >
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
      <BuyNowModal
        project={project}
        open={isOpen}
        close={closeModal}
        availableNFTs={availableNFTs}
      />
    </SubstrateContextProvider>
  );
}

const BuyNowModal = ({ project, open, close, availableNFTs }: BuyNowModalProps) => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const { isConnected, address, disconnectWallet } = useSubstrateContext();
  // const closeModalRef = useRef(null);
  const [value, setValue] = useState<number>(1);

  const incrementValue = () => {
    if (value == availableNFTs.length) {
      return toast.error('You have reached available maximum unit purchase');
    }
    setValue(prev => prev + 1);
  };
  const decrementValue = () => {
    if (value === 1) return;
    setValue(prev => prev - 1);
  };

  const onBuyNft = async () => {
    // console.log(address, {
    //   collectionId: project.id,
    //   nftType: project.type,
    //   quantity: value
    // });
    setIsLoading(true);
    await buyNft(address, {
      collectionId: project.id,
      nftType: project.type,
      quantity: value
    });
    setIsLoading(false);
    close();
  };

  return (
    <ModalContainer
      title={'Summary'}
      openModal={open}
      closeModal={close}
      // ref={closeModalRef}
    >
      <section className="flex w-full flex-col gap-[36px]">
        <div className="flex items-center gap-6 border-b border-foreground pb-[36px]">
          <Image
            src={project.image}
            alt={project.title}
            width={136}
            height={89}
            className="rounded-[6px] bg-foreground/50"
          />

          <ul className="flex flex-col gap-2 text-[0/75rem]/[1.5rem]">
            <li className="font-light ">
              By{' '}
              <BaseButton className="text-accent">@{project.foundationName}</BaseButton>
            </li>
            <li>{project.title}</li>
            <li>{`${availableNFTs.length} of ${project.noOfNFTs} NFTs available`}</li>
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
            <dd>{formatPrice(value * (parseInt(project?.price) || 1))}</dd>
          </dl>
          <p className="text-[0.75rem]/[1.5rem] font-light">
            Price for 1 NFT = {formatPrice(project?.price || 0)}
          </p>
        </div>

        {isConnected ? (
          <Button variant="primary" fullWidth disabled={loading} onClick={onBuyNft}>
            {loading ? 'processing' : 'Make payment'}{' '}
            {loading && (
              <Icons.spin className="h-[18px] w-[18px] animate-spin stroke-background" />
            )}
          </Button>
        ) : (
          <ConnectPolkadotWallet />
        )}

        {isConnected && (
          <div className=" flex items-center justify-between">
            <span></span>
            <BaseButton
              onClick={disconnectWallet}
              className="broder flex items-center gap-2 rounded border-green-800 p-2 text-[0.75rem]/[1.5rem] font-light text-accent"
            >
              {' '}
              <Icons.Logout className="h-4 w-4" /> {shortenAddress(address)}
            </BaseButton>
          </div>
        )}
      </section>
    </ModalContainer>
  );
};
