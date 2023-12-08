import MainContainer from "../containers/main";
import AppLayout from "./appLayout";
import Backdrop from "./backdrop";

export default function DetailLayout({ backdrop, children, ...props }) {
  return (
    <AppLayout {...props}>
      <Backdrop>{backdrop}</Backdrop>
      <MainContainer>{children}</MainContainer>
    </AppLayout>
  );
}
