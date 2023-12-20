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
      <div className="flex flex-col relative">
        <div className="absolute z-0 left-0 right-0 top-0 h-[240px] bg-fill-bg-primary border-b border-stroke-border-default"></div>
        <MainContainer className="z-10 pt-10">
          <div className="mb-[20px]">{breadcrumb}</div>
          <div className="flex gap-[20px]">
            <div className="flex grow">{children}</div>
            <div className="max-md:hidden min-w-[392px]">{sidebar}</div>
          </div>
        </MainContainer>
      </div>
    </AppLayout>
  );
}
