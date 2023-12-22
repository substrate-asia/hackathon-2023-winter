import { siteImage } from '@/config/image';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '../icons';

export default function Footer() {
  return (
    <footer className="container flex flex-col items-center gap-6 py-10">
      <section className="flex w-full items-center justify-between px-[51px]">
        <Image src={siteImage.logo} alt="logo" width={236} height={60} priority />
        <ul className="flex items-center gap-6">
          <li>
            <Link
              href={''}
              className="text-primary transition-colors duration-300 hover:text-foreground"
            >
              <Icons.twitterX className="h-6 w-6" />
            </Link>
          </li>
          <li>
            <Link
              href={''}
              className="text-primary transition-colors duration-300 hover:text-foreground"
            >
              <Icons.instagram className="h-6 w-6" />
            </Link>
          </li>
          <li>
            <Link
              href={''}
              className="text-primary transition-colors duration-300 hover:text-foreground"
            >
              <Icons.youtube className="h-6 w-6" />
            </Link>
          </li>
        </ul>
      </section>

      <section className="flex w-full items-center justify-between px-[51px]">
        <p className="w-[441px] text-[1rem]/[1.5rem] font-light">
          Creating a fairer, trust-less and more sustainable real estate investment web3
          future
        </p>

        <div className="space-y-2">
          <h4 className="text-[1.25rem]/[1.8rem] font-bold capitalize">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href={'/'}
                className="text-[0.87rem]/[1.22rem] font-light underline-offset-4 hover:underline"
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href={'/'}
                className="text-[0.87rem]/[1.22rem] font-light underline-offset-4 hover:underline"
              >
                Conect a wallet
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-[1.25rem]/[1.8rem] font-bold capitalize">Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href={'/'}
                className="text-[0.87rem]/[1.22rem] font-light underline-offset-4 hover:underline"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href={'/'}
                className="text-[0.87rem]/[1.22rem] font-light underline-offset-4 hover:underline"
              >
                FAQ&apos;s
              </Link>
            </li>
            <li>
              <Link
                href={'/'}
                className="text-[0.87rem]/[1.22rem] font-light underline-offset-4 hover:underline"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </footer>
  );
}
