import { defineChain } from 'viem'

export const mandala = defineChain({
  id: 595,
  name: 'Acala Mandala Testnet',
  network: 'acala',
  nativeCurrency: {
    decimals: 18,
    name: 'mACA',
    symbol: 'mACA',
  },
  rpcUrls: {
    default: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    },
    public: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    }
  }
})
