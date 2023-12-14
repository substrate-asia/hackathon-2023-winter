import { Chain } from "wagmi";

export const moonbase = {
  id: 1287,
  name: "Moonbase Alpha TestNet",
  network: "Moonbase Alpha",
  nativeCurrency: {
    decimals: 18,
    name: "Moonbase",
    symbol: "DEV",
  },
  rpcUrls: {
    public: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
    default: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonbase", url: "https://moonbase.moonscan.io/" },
    default: { name: "Moonbase", url: "https://moonbase.moonscan.io/" },
  },
} as const satisfies Chain;
