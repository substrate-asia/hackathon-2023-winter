import MainContainer from "../containers/main";
import HowOpenQFWorks from "../howOpenQFWorks";
import AppLayout from "./appLayout";
import Backdrop from "./backdrop";

export default function ListLayout({
  title = "",
  description = "",
  backdrop,
  children,
  ...props
}) {
  return (
    <AppLayout {...props}>
      <Backdrop>{backdrop}</Backdrop>

      <MainContainer>
        <h1 className="text-text-primary text36bold">{title}</h1>
        <p className="text-text-brand-secondary text16semibold mt-2">
          {description}
        </p>

        <div className="mt-5">{children}</div>
      </MainContainer>

      <HowOpenQFWorks />
    </AppLayout>
  );
}
