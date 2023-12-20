import React, { useCallback, useState } from "react";
import { clearCookie, setCookie } from "@osn/common";
import { encodeAddress } from "@polkadot/util-crypto";
import { Chains } from "@osn/constants";

const ss58Format = {
  [Chains.polkadot]: 0,
};

const AccountContext = React.createContext();

export const AccountProvider = ({ account: _account, children }) => {
  const [account, setAccount] = useState(_account);

  const login = useCallback((acc) => {
    const account = {
      ...acc,
      address: encodeAddress(acc.address, ss58Format[acc.network]),
    };
    setAccount(account);
    if (typeof window !== "undefined") {
      const data = `${account.network}/${account.address}/${account.wallet}`;
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
