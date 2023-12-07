import React, { useCallback, useState } from "react";
import { clearCookie, setCookie } from "@osn/common";

const AccountContext = React.createContext();

export const AccountProvider = ({ account: _account, children }) => {
  const [account, setAccount] = useState(_account);

  const login = useCallback((account) => {
    setAccount(account);
    if (typeof window !== "undefined") {
      const data = `${account.network}/${account.address}`;
      setCookie("address", data, 7);
    }
  }, []);

  const logout = useCallback(() => {
    setAccount(null);
    if (typeof window !== "undefined") {
      clearCookie();
    }
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        login,
        logout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export function useAccountContext() {
  const context = React.useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccountContext must be used within a AccountProvider");
  }
  return context;
}

export const useAccount = () => {
  const { account } = useAccountContext(AccountContext);
  return account;
};

export const useLogin = () => {
  const { login } = useAccountContext(AccountContext);
  return login;
};

export const useLogout = () => {
  const { logout } = useAccountContext(AccountContext);
  return logout;
};

export default AccountContext;
