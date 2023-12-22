import Hero from '@/sections/home/hero-header';
import Features from '@/sections/home/features';
import HowItWork from '@/sections/home/how-it-work';
import { PlanetFundingSection } from '@/sections/home/planet-funding';
import FAQs from '@/sections/home/faqs';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWork />
      <PlanetFundingSection />
      <FAQs />
    </main>
  );
}
