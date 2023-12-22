import { Icons } from '@/components/icons';
import HowItWorkCard from './how-it-work-card';
import { Button } from '@/components/ui/button';

export default function HowItWork() {
  return (
    <>
      <section
        id="how-it-works"
        aria-label="index-about"
        className="container my-[144px] flex w-full  flex-col items-center justify-center gap-6"
      >
        <h2 className="w-full max-w-[1071px] text-center text-[2.625rem]/[4.375rem] font-bold">
          Collecting eco-friendly NFTs is as easy as taking a walk in the park.
          Here&apos;s how:
        </h2>
        <p className="text-center text-[1rem] font-light">
          Collect digital art that makes a difference.
        </p>
      </section>
      <section className="container w-full px-[100px]">
        <div className="grid w-full grid-cols-3 gap-x-5 gap-y-10">
          <HowItWorkCard
            title="Explore Collections"
            icon={<Icons.discovery className="h-[21px] w-[21px]  stroke-primary" />}
          >
            Browse our curated NFT collections that celebrate nature and sustainability.
            Each collection showcases unique eco-friendly artworks.
          </HowItWorkCard>
          <HowItWorkCard
            title="Select Your Favorites"
            icon={<Icons.heart className="h-[21px] w-[21px]  stroke-primary" />}
          >
            Choose the NFTs that resonate with you and your values. You can view detailed
            information about each NFT, including its creator and story.
          </HowItWorkCard>
          <HowItWorkCard
            title="Purchase NFTs"
            icon={<Icons.wallet className="h-[21px] w-[21px]  stroke-primary" />}
          >
            When you&apos;ve found the perfect eco-friendly NFT, simply click to purchase
            it. Complete the secure transaction using cryptocurrency.
          </HowItWorkCard>
          <HowItWorkCard
            title="Ownership and Provenance"
            icon={<Icons.password className="h-[21px] w-[21px]  stroke-primary" />}
          >
            Your NFT is now in your digital wallet, proving your ownership and supporting
            the artist. Transparency and blockchain technology ensure the NFT&apos;s
            authenticity and provenance.
          </HowItWorkCard>
          <HowItWorkCard
            title="Ownership and Provenance"
            icon={<Icons.swap className="h-[21px] w-[21px]  stroke-primary" />}
          >
            A portion of the proceeds from each NFT sale goes towards environmental
            initiatives. You&aposr;e not just buying art; you&apos;re making a positive
            impact on the environment.
          </HowItWorkCard>
          <HowItWorkCard
            title="Engage with the Community"
            icon={<Icons.users className="h-[21px] w-[21px]  stroke-primary" />}
          >
            Join our community of eco-conscious art enthusiasts. Share your passion,
            insights, and learn from like-minded individuals.
          </HowItWorkCard>
        </div>
        <div className="mb-[100px] mt-[40px] flex items-center justify-center">
          <Button>Get started</Button>
        </div>
      </section>

      {/* <section
        id="project-funding"
        aria-label="index-funding"
        className="my-[100px] inline-flex flex-col items-center justify-center gap-10 px-[100px]"
      >
        <div className="space-y-4 text-center">
          <h3 className="text-[2.6rem]/[4.4rem] font-bold">
            Planet positive project funding
          </h3>
          <p className="text-[1rem] font-light">
            Every NFT purchase is not just a transaction; it&apos;s a step towards a
            greener future. Join us in the journey of making a positive impact on our
            planet while collecting beautiful, eco-conscious digital art.
          </p>
        </div>
        <Button>Learn more</Button>
      </section> */}
    </>
  );
}
