import { Footer } from "@osn/common-ui";
import Header from "../header";
import Toast from "../toast";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Toast />
    </div>
  );
}
