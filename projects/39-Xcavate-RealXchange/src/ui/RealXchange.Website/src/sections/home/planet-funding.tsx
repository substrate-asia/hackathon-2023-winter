import { Button } from '@/components/ui/button';
import { siteImage } from '@/config/image';
import Image from 'next/image';

export function PlanetFundingSection() {
  return (
    <section className="flex w-full  flex-col items-center justify-center gap-6 bg-foreground px-[180px] py-[174px] text-primary-light">
      <Image src={siteImage.hand} alt="" width={134} height={120} />
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h3 className="text-[2.6rem]/[4.4rem] font-bold">
          Planet positive project funding
        </h3>
        <p className="max-w-[502px] text-[1rem] font-light">
          Every NFT purchase is not just a transaction; it&#39;s a step towards a greener
          future. Join us in the journey of making a positive impact on our planet while
          collecting beautiful, eco-conscious digital art.
        </p>
        <div className="mt-6 flex w-full items-center justify-center gap-6">
          <Button href="/" variant={'ghost'}>
            Learn more
          </Button>
          <Button href="/marketplace" variant={'primary'}>
            Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
}
