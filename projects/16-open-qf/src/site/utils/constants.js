export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://polkadot-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/dot",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/polkadot",
  },
  {
    name: "RadiumBlock",
    url: "wss://polkadot.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-polkadot.luckyfriday.io",
  },
];

export const PROJECT_NAME = "OpenSquare-OpenQF";

export const TOAST_TYPES = {
  SUCCESS: "Success",
  ERROR: "Error",
  INFO: "Info",
  PENDING: "Pending",
};

/**
 * @description Polkadot decimals
 */
export const DECIMALS = 10;

export const EmptyList = {
  items: [],
  page: 1,
  pageSize: 0,
  total: 0,
};

export const CATEGORIES = {
  explorer: "Explorer",
  wallet: "Wallet",
  governance: "Governance",
  infrastructure: "Infrastructure",
  data: "Data",
  libs: "Libs",
};
