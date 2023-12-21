import MainContainer from "./containers/main";

export default function HowOpenQFWorks() {
  return (
    <div className="bg-fill-bg-primary">
      <MainContainer>
        <div className="max-w-[590px]">
          <h3 className="text24bold text-text-primary mb-5">
            How OpenQF Works
          </h3>
          <p className="text16semibold text-text-tertiary">
            Quadratic Funding (QF) is a crowd-funding mechanism that amplifies
            available resources by inviting community members to make donations
            (big or small) that act as votes on where to allocate funds. The
            broader the support, the bigger the match!
          </p>
        </div>
      </MainContainer>
    </div>
  );
}
