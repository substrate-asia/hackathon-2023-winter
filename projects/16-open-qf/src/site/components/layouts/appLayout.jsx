import { Footer, Header } from "@osn/common-ui";

export default function AppLayout({ children }) {
  return (
    <div className="h-full min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
