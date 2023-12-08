import { Footer } from "@osn/common-ui";
import Header from "../header";
import { cn } from "@/utils";
import Toast from "../toast";

export default function AppLayout({ children, backdrop }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div
        className={cn(
          "w-full h-[308px] border-b border-stroke-border-default bg-fill-bg-primary",
          "absolute top-20",
          "-z-50",
        )}
      >
        {backdrop}
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
      <Toast />
    </div>
  );
}
