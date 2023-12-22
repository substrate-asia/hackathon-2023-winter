'use client';
import React, { useContext } from 'react'
import Image from 'next/image'
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Select,
  Option
} from "..";
import Link from 'next/link'
// import { TransactionContext } from '../wallet-extension/wallet-context'

import { WalletButton } from '../wallet_button/BaseWalletPolkadot';

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }
  }, []);
 
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal" placeholder={undefined}>
        <Link href="/market" className="flex items-center">
          Marketplace
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal" placeholder={undefined}>
        <a href="#" className="flex items-center">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal" placeholder={undefined}>
        <a href="#" className="flex items-center">
          Docs
        </a>
      </Typography>
    </ul>
  );
 
  return (
      <Navbar className="border-b-2 border-gray-200 sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4" placeholder={undefined}>
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center">
            <Link href="/">
            <Image 
              alt='logo'
              src='/logo.png'
              height='50'
              width='50'
              />
            </Link>
              <Typography
            as="a"
            href="/"
            className="mr-4 cursor-pointer py-1.5 font-medium" placeholder={undefined}>
                XCMarketplace
              </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              <WalletButton />
            </div>
          </div>
        </div>
        <MobileNav open={openNav}>
          {navList}
        </MobileNav>
      </Navbar>
  );
}