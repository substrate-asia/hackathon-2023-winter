import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

const usePolkadotApi = () => {
    const [api, setApi] = useState();

    const setup = async () => {
        const wsProvider = new WsProvider("wss://shibuya.public.blastapi.io");
        // const wsProvider = new WsProvider();
        const apiPromise = await ApiPromise.create({ provider: wsProvider });
        setApi(apiPromise);
    };

    useEffect(() => {
        setup();
    }, []);

    return {
        api,
    };
};

export default usePolkadotApi;
