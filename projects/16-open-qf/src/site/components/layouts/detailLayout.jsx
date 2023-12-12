import MainContainer from "../containers/main";
import AppLayout from "./appLayout";
import Backdrop from "./backdrop";

export default function DetailLayout({
  backdrop,
  children,
  sidebar,
  ...props
}) {
  return (
    <AppLayout {...props}>
      <MainContainer>
        <div className="flex gap-[20px]">
          <div className="flex grow">{children}</div>
          <div className="min-w-[392px]">{sidebar}</div>
        </div>
      </MainContainer>
    </AppLayout>
  );
}
