import { Footer } from "@osn/common-ui";
import Header from "../header";

export default function AppLayout({ children }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
