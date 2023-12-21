import getApi from "@osn/common/es/services/chain/api";
import { useEffect, useState } from "react";
import { useAccount } from "@/context/account";
import { useActiveNodeUrl } from "@/context/node";

export default function useApi() {
  const account = useAccount();
  const chain = account?.network;

  const endpoint = useActiveNodeUrl();
  const [api, setApi] = useState();

  useEffect(() => {
    if (!chain || !endpoint) {
      return;
    }

    getApi(chain, endpoint).then((api) => {
      setApi(api);
    });
  }, [chain, endpoint]);

  return api;
}
