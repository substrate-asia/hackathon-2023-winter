import MainContainer from "../containers/main";
import AppLayout from "./appLayout";

export default function DetailLayout({ backdrop, children, ...props }) {
  return (
    <AppLayout backdrop={backdrop} {...props}>
      <MainContainer>{children}</MainContainer>
    </AppLayout>
  );
}
