export const sortWallet = (wallets) => {
    if (!wallets[0].extensionName.includes("subwallet")) {
      [wallets[0], wallets[1]] = [wallets[1], wallets[0]];
    }
    return wallets;
  };