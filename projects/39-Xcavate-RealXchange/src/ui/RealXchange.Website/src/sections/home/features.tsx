import FeaturedCategories from './featured-categories';

export default function Features() {
  return (
    <section
      id="features"
      aria-label="index-features"
      className="container flex items-center justify-between gap-[74px] p-[100px]"
    >
      <div className="max-w-[387px] space-y-6">
        <h3 className="text-[2.625rem]/[4.375rem] font-bold">Features</h3>
        <p className="text-[1rem] font-light">
          stay informed about market trends, and connect with like-minded individuals who
          share your vision for the future of real estate.
        </p>
      </div>
      {/* <div className="h-full w-full  overflow-x-auto"> */}
      <FeaturedCategories />
      {/* </div> */}
    </section>
  );
}
