import { BaseButton } from '@/components/ui/base-button';
import { siteImage } from '@/config/image';
import Image from 'next/image';

export default function Profile() {
  return (
    <>
      <section className="container  grid w-full gap-10 px-[100px] py-16">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={siteImage.avatar} alt="user" width={100} height={100} priority />

            <div className="flex flex-col items-start gap-2">
              <h1 className="text-[1.5rem] font-bold">Trillion_Treesfoundation</h1>
              <BaseButton
                href="#"
                className="text-[1rem]/[1.5rem]  font-light text-[#4E4E4E]"
              >
                Trillion.Trees.foundation
              </BaseButton>
            </div>
          </div>
        </div>
        <p className="max-w-[822px] text-[0.875rem]/[1.5rem] font-light">
          Trillion trees foundation is dedicated to creating a sustainable and
          eco-friendly future. Our mission is to promote environmental conservation,
          renewable energy, and community empowerment for a greener planet.
        </p>

        <div className="flex w-full max-w-[822px] items-start gap-10">
          <OverviewItem title="Active projects" value="5" />
          <OverviewItem title="Projects delivered" value="5" />
          <OverviewItem title="NFTS Sold" value="1,000" />
          <OverviewItem title="Total raised" value="$1m" />
        </div>
      </section>
    </>
  );
}

const OverviewItem = ({ title, value }: { title: string; value: string }) => (
  <dl className="flex flex-col-reverse items-center gap-2">
    <dt className="text-[1rem]/[1.5rem] font-light ">{title}</dt>
    <dd className="text-[1.125rem] font-bold">{value}</dd>
  </dl>
);
