import MainContainer from "@/components/containers/main";
import HowOpenQFWorks from "@/components/howOpenQFWorks";
import { ROUND_LIST_DATA } from "@/fixtures/roundList";
import AppLayout from "components/layouts/appLayout";
import RoundCard from "@/components/card/round";

export default function HomePage() {
  return (
    <AppLayout>
      <MainContainer>
        <hgroup>
          <h1 className="text-text-primary text36bold">Program Rounds</h1>
          <p className="text-text-brand-secondary text16semibold mt-2">
            How OpenQF Works
          </p>
        </hgroup>

        <div className="mt-5 space-y-5">
          {ROUND_LIST_DATA.map((data, idx) => (
            <RoundCard key={idx} data={data} />
          ))}
        </div>
      </MainContainer>

      <HowOpenQFWorks />
    </AppLayout>
  );
}
