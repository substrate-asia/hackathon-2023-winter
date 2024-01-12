import { useRef, useState } from 'react';
import { BaseButton, Button } from '../ui/button';
import ModalContainer from '../ui/modal-container';
import { IconProps } from '../export-icons';
import { useSubstrateContext } from '@/context/polkadot-contex';
import { Icons } from '../icons';

export default function ConnectPolkadotWallet() {
  const { isLoading, connectSubstrateWallet } = useSubstrateContext();
  const [isOpen, setIsOpen] = useState(false);
  const closeModalRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
      <Button fullWidth onClick={openModal}>
        Connect a Polkadot wallet
      </Button>
      <p className="text-foreground/50">
        This wallet would be used to sign your purchase transaction
      </p>

      <ModalContainer
        title="Connect Wallet"
        openModal={isOpen}
        closeModal={closeModal}
        ref={closeModalRef}
      >
        <BaseButton
          className="flex w-full items-center justify-between rounded-lg border border-foreground px-4 py-2"
          onClick={connectSubstrateWallet}
        >
          <div className="flex items-center gap-2">
            <Icons.Tailsman className="h-[42px] w-[42px]" />

            <span className="text-[1rem]/[1.5rem]">Tailsman</span>
          </div>
          {isLoading ? (
            <StatusIcon className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-[0.75rem]/[1.5rem] font-light text-primary">
              Recommended
            </span>
          )}
        </BaseButton>
      </ModalContainer>
    </div>
  );
}

const StatusIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M2.45 14.97c1.07 3.44 3.95 6.09 7.53 6.82M2.05 10.98A9.996 9.996 0 0 1 12 2c5.18 0 9.44 3.94 9.95 8.98M14.01 21.8c3.57-.73 6.44-3.35 7.53-6.78"
      stroke="#FF8A65"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
