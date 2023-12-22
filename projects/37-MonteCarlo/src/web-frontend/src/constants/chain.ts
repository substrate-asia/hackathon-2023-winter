export enum WalletChain {
  HOME = 'HOME',
  SOL = 'SOL',
  ETH = 'ETH',
  DOT = 'DOT',
}

const host = window.location.host
export let DEMO_ENV = WalletChain.HOME

if (host.startsWith('sol')) {
  DEMO_ENV = WalletChain.SOL
}
if (host.startsWith('eth')) {
  DEMO_ENV = WalletChain.ETH
}
if (host.startsWith('dot')) {
  DEMO_ENV = WalletChain.DOT
}
if (import.meta.env.VITE_APP_DEMO_ENV) {
  DEMO_ENV = import.meta.env.VITE_APP_DEMO_ENV as WalletChain
}

console.info('DEMO_ENV', DEMO_ENV)

export const CURRENCY_SYMBOL = {
  [WalletChain.HOME]: '-',
  [WalletChain.SOL]: 'SOL',
  [WalletChain.ETH]: 'MATIC',
  [WalletChain.DOT]: 'CBT',
}[DEMO_ENV]
