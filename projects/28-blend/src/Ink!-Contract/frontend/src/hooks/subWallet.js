import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccount, setIsConnected } from "../redux/slices/imageSlice";
import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { toast } from "react-toastify";

const useSubwallet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialExtensionState = {
    error: null,
    loading: false,
    data: undefined,
  };

  const [state, setState] = useState(initialExtensionState);
  const [injector, setInjector] = useState();

  const handleConnect = () => {
    setState({ ...initialExtensionState, loading: true });

    web3Enable("blend")
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) {
          if (typeof window !== undefined) {
            window.open("https://www.subwallet.app/download.html", "_blank");
          }
          return Promise.reject(new Error("NO_INJECTED_EXTENSIONS"));
        }

        return web3Accounts();
      })
      .then((accounts) => {
        if (!accounts.length) {
          return Promise.reject(new Error("NO_ACCOUNTS"));
        }

        setState({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: accounts[0],
          },
        });

        dispatch(setIsConnected(true));
        dispatch(setAccount(accounts[0].address));

        if (typeof window !== undefined && window.localStorage) {
          localStorage.setItem("isConnected", true);
        }

        return web3FromAddress(accounts[0].address);
      })
      .then((injctor) => {
        setInjector(injctor);
      })
      .catch((error) => {
        console.error("Error with connect", error);
        setState({
          error,
          loading: false,
          data: undefined,
        });
      });
  };

  const handleDisconnect = () => {
    setState({ ...initialExtensionState, loading: true });

    setState({
      error: null,
      loading: false,
      data: undefined,
    });

    dispatch(setIsConnected(false));
    if (typeof window !== undefined && window.localStorage) {
      localStorage.setItem("isConnected", false);
    }

    dispatch(setAccount(null));

    // Redirect to the home page or another appropriate location
    navigate("/connect");
  };

  return {
    state,
    injector,
    handleConnect,
    handleDisconnect,
  };
};

export default useSubwallet;
