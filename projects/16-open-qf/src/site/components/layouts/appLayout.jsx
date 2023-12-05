import { Footer, Header } from "@osn/common-ui";

export default function AppLayout({ children }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
