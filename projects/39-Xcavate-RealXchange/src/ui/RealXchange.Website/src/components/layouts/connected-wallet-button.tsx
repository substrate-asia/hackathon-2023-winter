import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { shortenAddress } from '@/lib/utils';

type DropdownProps = {
  onClick: () => void;
  address: string;
};

export default function ConnectedWalletButton({ onClick, address }: DropdownProps) {
  return (
    <Menu as="header" className="relative inline-block">
      <Menu.Button
        className={
          'flex items-center gap-2 rounded-3xl border border-black p-2 text-[0.875rem]/[1.25rem] font-medium text-primary'
        }
      >
        {shortenAddress(address)}
        <SVGIcon />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-16 z-[100] flex w-[185px] min-w-[260px] origin-top-right flex-col items-start gap-6 rounded-lg bg-white  p-4 py-6 text-[1rem]/[1.5rem] shadow-lg">
          {siteConfig.profileNav.map(nav => (
            <Menu.Item key={nav.title}>
              <Link
                href={nav.href}
                className="flex items-center gap-4 transition-colors duration-300 hover:text-primary"
              >
                {nav.icon} {nav.title}
              </Link>
            </Menu.Item>
          ))}
          <Menu.Item>
            <button className="mt-10" onClick={onClick}>
              Disconnect wallet
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

const SVGIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <circle
      cx="10.9399"
      cy="10.1283"
      r="9.5"
      fill="#4E4E4E"
      stroke="url(#paint0_linear_6867_5306)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6867_5306"
        x1="10.9399"
        y1="0.128311"
        x2="10.9399"
        y2="20.1283"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFB0B2" />
        <stop offset="1" stopColor="#FFB0B2" />
      </linearGradient>
    </defs>
  </svg>
);
