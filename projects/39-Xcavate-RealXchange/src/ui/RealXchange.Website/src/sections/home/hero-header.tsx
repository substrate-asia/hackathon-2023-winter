import { Button } from '@/components/ui/button';
import { siteImage } from '@/config/image';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      className="mx-auto flex w-full items-center justify-center space-x-[127px] pb-[100px] pt-[146px]"
      id="hero"
      aria-label="hero-heading"
    >
      <div className="w-full space-y-6 lg:max-w-[608px]">
        <h1 className="text-[3.5rem]/[4.375rem] font-bold">
          A more sustainable web3 future
        </h1>
        <p className="pb-10 text-[1.125rem]/[1.5rem] font-light">
          Re-defining environmental, ecological and social project funding through an
          interactive NFT marketplace.{' '}
        </p>

        <Button href="/marketplace">Visit the marketplace</Button>
      </div>

      <Image src={siteImage.hero} alt="hero-heaing" width={504} height={432} priority />
    </section>
  );
}
