import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header/Header";
import classes from "./style.module.less";
import SideBar from "../SideBar/SideBar";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { arbitrum, mainnet } from 'viem/chains'
import { defineChain } from "viem";
const Layout = ({ children }: any) => {
  const [show, setShow] = useState(false)
  const [chainInfo, setChainInfo] = useState("" as any)
  let wagmiConfig: any;
  const init = async () => {
    const data = JSON.parse(localStorage.getItem("chainInfo") as any);
    let chain = defineChain({
      facuetsUrl: data.chainConf.faucetUrl,
      id: data.chainConf.chainId,
      name: data.chainConf.networkName,
      network: data.chainConf.networkName,
      nativeCurrency: {
        name: data.chainConf.currencySymbol,
        symbol: data.chainConf.currencySymbol,
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [data.chainConf.rpcUrl],
          webSocket: [],
        },
        public: {
          http: [data.chainConf.rpcUrl],
          webSocket: [],
        },
      },
      blockExplorers: {
        default: {
          name: data.chainConf.blockExplorer,
          url: data.chainConf.blockExplorer,
        },
      },
    });
    setChainInfo(chain)
  }
  useEffect(() => {
    init()
  }, [])
  if (chainInfo) {
    const projectId = "bce62feae59107ac8ebbdc9aa8810513";
    const metadata = {
      name: "Web3Modal",
      description: "Web3Modal Example",
      url: "https://web3modal.com",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    };
    const chains = [chainInfo, mainnet];
    wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
    createWeb3Modal({ wagmiConfig, projectId, chains });
  }
  useEffect(() => {
    setShow(true)
  }, [])
  return (
    // <></>
    <>
      {
        chainInfo && show && <WagmiConfig config={wagmiConfig}>
          <div className={classes.container}>
            <div className={classes.headerContainer}>
              <Header />
            </div>
            <div className={classes.mainContainer}>
              <div className={classes.sidebarMenu}>
                <SideBar />
              </div>
              <div className={classes.mainPanel}>
                <div className={classes.mainPanelTopContainer}>{children}</div>
                <div className={classes.footerRight}>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </WagmiConfig>}</>
  );
};

export default React.memo(Layout);
