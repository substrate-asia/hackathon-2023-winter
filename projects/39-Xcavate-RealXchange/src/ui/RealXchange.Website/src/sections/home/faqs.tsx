import { Icons } from '@/components/icons';
import { siteImage } from '@/config/image';
import Image from 'next/image';

export default function FAQs() {
  return (
    <section
      id="faqs"
      aria-label="frequently asked questions"
      className="container inline-flex flex-col items-center justify-center gap-4 px-[100px] py-[174px]"
    >
      <Image src={siteImage.faq} alt="faq" width={44} height={91} priority />

      <h3 className="text-center text-[2.625rem]/[4.375rem] font-bold">FAQ</h3>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex w-[556px] items-center justify-between rounded-lg border border-foreground px-4 py-6">
          <span className="text-[1rem] font-normal">What is RealXchange ?</span>{' '}
          <Icons.ArrowDown className="h-[18px] w-[18px] fill-foreground" />
        </div>
        <div className="flex w-[556px] items-center justify-between rounded-lg border border-foreground px-4 py-6">
          <span className="text-[1rem] font-normal">What is RealXchange ?</span>{' '}
          <Icons.ArrowDown className="h-[18px] w-[18px] fill-foreground" />
        </div>
        <div className="flex w-[556px] items-center justify-between rounded-lg border border-foreground px-4 py-6">
          <span className="text-[1rem] font-normal">What is RealXchange ?</span>{' '}
          <Icons.ArrowDown className="h-[18px] w-[18px] fill-foreground" />
        </div>
        <div className="flex w-[556px] items-center justify-between rounded-lg border border-foreground px-4 py-6">
          <span className="text-[1rem] font-normal">What is RealXchange ?</span>{' '}
          <Icons.ArrowDown className="h-[18px] w-[18px] fill-foreground" />
        </div>
        <div className="flex w-[556px] items-center justify-between rounded-lg border border-foreground px-4 py-6">
          <span className="text-[1rem] font-normal">What is RealXchange ?</span>{' '}
          <Icons.ArrowDown className="h-[18px] w-[18px] fill-foreground" />
        </div>
      </div>
    </section>
  );
}
