'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Icons } from '../icons';
import { BaseButton } from './base-button';

export interface PreviewModalContainerProps {
  header: {
    title: string;
    description: string;
  };
  ref?: any;
  openModal: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
}

export default function PreviewModalContainer({
  header,
  ref,
  openModal,
  closeModal,
  children
}: PreviewModalContainerProps) {
  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="fixed z-50" initialFocus={ref} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-foreground/[0.52] backdrop-blur-[5px] backdrop-filter transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 top-[156px] overflow-y-auto">
            <div className="te flex min-h-full items-start justify-center p-4 md:p-[119px]">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-flex h-full w-full transform flex-col gap-4 overflow-hidden rounded-lg bg-background px-10 pb-10 pt-[62px] align-middle shadow-modal  transition-all">
                  <header className="flex w-full items-center justify-between">
                    <Dialog.Title as="hgroup" className="">
                      <h3 className="text-[1.125rem] font-medium">{header.title}</h3>
                      <p className="text-[1rem] font-light">{header.title}</p>
                    </Dialog.Title>
                    <BaseButton onClick={closeModal}>
                      <Icons.closeSquare className="h-6 w-6 stroke-foreground p-[2.5px]" />
                    </BaseButton>
                  </header>
                  <main className="h-full w-full">{children}</main>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
