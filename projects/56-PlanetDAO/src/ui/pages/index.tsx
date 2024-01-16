import { Button } from '@heathmont/moon-core-tw';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('loggedin') && localStorage.getItem('login-type')) {
      router.push('/joined');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>PlanetDAO</title>
        <meta name="description" content="PlanetDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-frieza-60 w-full pb-16 md:min-h-full-min-header flex flex-col items-center gap-8 px-4">
        <div className="flex flex-col gap-4 items-center text-gohan mt-16">
          <h2 className="font-bold text-moon-48">Create a fair and transparent community</h2>
          <h5>PlanetDAO enables you to create your decentralized autonomous organization platform (DAO) in just a few clicks.</h5>
        </div>
        <Link href="/register">
          <Button className="shadow-moon-md">Get started</Button>
        </Link>
        <Image src="/home/community-example.png" height={500} width={900} alt="" />
      </div>
      <div className="bg-brief flex flex-col gap-20 text-gohan py-16">
        <div className="flex homepage-container flex-col-reverse items-center md:flex-row md:gap-16 md:items-start">
          <div className="flex flex-col gap-8 pt-10">
            <h3 className="text-moon-32 font-bold">Style your community</h3>
            <p>Edit your community page through the PlanetDAO editor, and style it the way you want.</p>
          </div>
          <Image className="shrink-0" src="/home/style-community.png" alt="" width={420} height={360} />
        </div>
        <div className="flex homepage-container flex-col items-center md:flex-row md:gap-16 md:items-start">
          <Image className="shrink-0" src="/home/raise-funds.png" alt="" width={420} height={360} />
          <div className="flex flex-col gap-8 pt-10">
            <h3 className="text-moon-32 font-bold">Raise funds for your community goals</h3>
            <p>Through subscriptions and donations you can raise funds for your decentralized wallet.</p>
          </div>
        </div>
      </div>
      <div className="bg-gohan flex flex-col gap-20 text-bulma py-16">
        <div className="flex homepage-container flex-col-reverse items-center md:flex-row md:gap-16 md:items-start">
          <div className="flex flex-col gap-8 pt-10">
            <h3 className="text-moon-32 font-bold">Make decisions together</h3>
            <p>Members of a community have voting power based on their role and their contribution. All members can vote on the ideas they believe will reach the community’s goals.</p>
          </div>
          <Image className="shrink-0" src="/home/decision-together.png" alt="" width={420} height={360} />
        </div>
        <div className="flex homepage-container flex-col items-center md:flex-row md:gap-16 md:items-start">
          <Image className="shrink-0" src="/home/reward-community.png" alt="" width={420} height={360} />
          <div className="flex flex-col gap-8 pt-10">
            <h3 className="text-moon-32 font-bold">Reward your community</h3>
            <p>The more active you are as a member in your community, the more badges you earn. The more badges you earn, the more voting power you have.</p>
          </div>
        </div>
      </div>
      <div className="bg-brief flex flex-col gap-20 text-gohan py-16">
        <div className="flex homepage-container flex-col-reverse items-center md:flex-row md:gap-16 md:items-start">
          <div className="flex flex-col gap-8 pt-10">
            <h3 className="text-moon-32 font-bold">Connect all your wallets</h3>
            <p>By combining Moonbeam and Wormhole cross-chains we connect assets from many different blockchains to scale your DAO community rapidly.</p>
          </div>
          <Image className="shrink-0" src="/home/connect-wallets.png" alt="" width={420} height={360} />
        </div>
      </div>
    </>
  );
}
