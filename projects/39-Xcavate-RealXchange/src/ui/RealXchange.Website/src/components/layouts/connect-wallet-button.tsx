import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Icons } from '../icons';
import { BaseButton } from '../ui/base-button';
import ConnectKiltButton from './connect-kilt-button';

export default function ConnectWalletButton() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center gap-2.5 rounded-3xl bg-primary px-4 py-2 text-[0.875rem]/[1.25rem] text-primary-light duration-700 hover:bg-primary/90">
            <span>Connect Wallet</span>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 top-16 z-10 w-[460px] min-w-[518px] -translate-x-1/2 transform px-4 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-connect">
                <div className="relative inline-flex w-full flex-col items-center gap-6 bg-primary-light px-6 pb-10 pt-6">
                  <header className="flex w-full items-center justify-between">
                    <h3 className="text-[1rem]/[1.5rem] font-normal">Select Wallet</h3>
                    <BaseButton>
                      <Icons.closeSquare className="h-6 w-6 stroke-foreground p-[2.5px]" />
                    </BaseButton>
                  </header>
                  <ConnectKiltButton />
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
