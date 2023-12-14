import { Breadcrumb } from "@osn/common-ui";
import MainContainer from "../containers/main";
import AppLayout from "./appLayout";
import { useRouter } from "next/router";

export default function ApplyLayout({ children }) {
  const router = useRouter();

  return (
    <AppLayout>
      <MainContainer className="pt-10 space-y-5">
        <Breadcrumb
          backButtonRender={(button) => (
            <span
              role="link"
              onClick={() => {
                router.back();
              }}
            >
              {button}
            </span>
          )}
        >
          <Breadcrumb.Item>
            <span className="text-text-primary">New Project</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div>{children}</div>
      </MainContainer>
    </AppLayout>
  );
}
