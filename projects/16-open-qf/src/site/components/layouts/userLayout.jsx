import AppLayout from "./appLayout";

export default function UserLayout({ children }) {
  return (
    <AppLayout>
      <div>{children}</div>
    </AppLayout>
  );
}
