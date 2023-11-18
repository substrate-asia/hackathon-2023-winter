'use client'
import React from 'react'
import { Button, Navbar as FlowbiteNav } from 'flowbite-react'
import Image from 'next/image'
import { ConnectWallet } from '../WalletButton'

function Navbar () {
  return (
    <FlowbiteNav className='fixed w-full z-20 top-0 start-0 bg-transparent backdrop-blur-md'>
      <FlowbiteNav.Brand href='https://flowbite-react.com'>
        <Image
          src='/vercel.svg'
          className='mr-3 h-6 sm:h-9'
          alt='Flowbite React Logo'
          width={64}
          height={64}
        />
      </FlowbiteNav.Brand>
      <div className='flex md:order-2'>
        <ConnectWallet>Get started</ConnectWallet>
        <FlowbiteNav.Toggle />
      </div>
      <FlowbiteNav.Collapse>
        <FlowbiteNav.Link href='#' active>
          Home
        </FlowbiteNav.Link>
        <FlowbiteNav.Link href='#'>About</FlowbiteNav.Link>
        <FlowbiteNav.Link href='#'>Services</FlowbiteNav.Link>
        <FlowbiteNav.Link href='#'>Pricing</FlowbiteNav.Link>
        <FlowbiteNav.Link href='#'>Contact</FlowbiteNav.Link>
      </FlowbiteNav.Collapse>
    </FlowbiteNav>
  )
}

export { Navbar }
