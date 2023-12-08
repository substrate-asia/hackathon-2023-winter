import { ServerSidePropsProvider } from "@/context/serverSideProps";
import { loadAccount } from "./loadAccount";
import { AccountProvider } from "@/context/account";
import { NodeProvider } from "@/context/node";

export function loadCommonServerSideProps(context) {
  return {
    ...loadAccount(context),
  };
}

export function CommonPageWrapper({ children, ...props }) {
  return (
    <AccountProvider account={props.account}>
      <ServerSidePropsProvider serverSideProps={props}>
        <NodeProvider>{children}</NodeProvider>
      </ServerSidePropsProvider>
    </AccountProvider>
  );
}

export function withCommonPageWrapper(Component) {
  return (props) => (
    <CommonPageWrapper {...props}>
      <Component {...props} />
    </CommonPageWrapper>
  );
}
