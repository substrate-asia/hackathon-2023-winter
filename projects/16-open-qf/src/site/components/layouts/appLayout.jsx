import { Footer } from "@osn/common-ui";
import Header from "../header";
import { cn } from "@/utils";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>

      <div
        className={cn(
          "[&_footer>div:first-child]:!max-w-7xl",
          "[&_footer>div>div:first-child]:!px-8 [&_footer>div>div:first-child]:max-sm:!px-5",
        )}
      >
        <Footer />
      </div>
    </div>
  );
}
