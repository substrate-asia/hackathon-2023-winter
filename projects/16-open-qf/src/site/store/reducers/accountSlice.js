import { createSlice } from "@reduxjs/toolkit";

import { setCookie, getCookie, clearCookie } from "@osn/common";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    account: undefined,
  },
  reducers: {
    setAccount: (state, { payload }) => {
      if (payload) {
        state.account = payload;
        if (typeof window !== "undefined") {
          const data = `${payload.network}/${payload.address}`;
          setCookie("address", data, 7);
          localStorage.setItem("lastLoginAddress", data);
        }
      } else {
        state.account = null;
        if (typeof window !== "undefined") {
          clearCookie();
        }
      }
    },
  },
});

export const { setAccount } = accountSlice.actions;

export const logout = () => async (dispatch) => {
  dispatch(setAccount(null));
};

export const accountSelector = (state) => {
  if (state.account.account) {
    return state.account.account;
  } else {
    if (typeof window !== "undefined") {
      const data = getCookie("address");
      if (data && data !== "undefined/undefined") {
        const [network, address] = data.split("/");
        const account = {
          address,
          network,
        };
        setAccount(account);
        return account;
      }
    }
    return null;
  }
};

export default accountSlice.reducer;
