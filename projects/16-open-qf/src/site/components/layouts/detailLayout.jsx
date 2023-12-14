import MainContainer from "../containers/main";
import AppLayout from "./appLayout";

export default function DetailLayout({
  children,
  breadcrumb,
  sidebar,
  ...props
}) {
  return (
    <AppLayout {...props}>
      <MainContainer>
        <div className="mb-[20px]">{breadcrumb}</div>
        <div className="flex gap-[20px]">
          <div className="flex grow">{children}</div>
          <div className="min-w-[392px]">{sidebar}</div>
        </div>
      </MainContainer>
    </AppLayout>
  );
}
