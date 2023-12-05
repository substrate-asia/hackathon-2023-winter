import MainContainer from "@/components/containers/main";
import HowOpenQFWorks from "@/components/howOpenQFWorks";
import AppLayout from "components/layouts/appLayout";

export default function HomePage() {
  return (
    <AppLayout>
      <MainContainer>
        <div>rounds page</div>
      </MainContainer>

      <HowOpenQFWorks />
    </AppLayout>
  );
}
