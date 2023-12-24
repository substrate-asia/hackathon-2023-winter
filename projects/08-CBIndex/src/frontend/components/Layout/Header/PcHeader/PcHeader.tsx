import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classes from "./style.module.less";
import Link from "next/link";
import Logo from "../Header/Logo/Logo";
import SoundNotice from "../SoundNotice/SoundNotice";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useNetwork } from "wagmi";
import { defineChain } from "viem";
import { ethers } from "ethers";
const PcHeadr = () => {
  const { chain, chains } = useNetwork();
  const router = useRouter();
  const web3modal = useWeb3Modal();
  const [show, setShow] = useState(false);
  const [chainId, setChainId] = useState(0);
  const [chainInfo, setChainInfo] = useState({} as any)
  const headerMenuList = [
    {
      key: "/activefund/vaults",
      label: "Active Fund",
      pathname: "/activefund/[...page]",
    },
  ];
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
    setShow(true);
  }, [])
  useEffect(() => {
    init()
  }, [chain]);

  useEffect(() => {
    if (chain) {
      setChainId(chain.id);
    } else {
      setChainId(0);
    }
  }, [chain]);
  return (
    <div className={classes.container}>
      <div className={classes.headerTopLayer}>
        <SoundNotice />
        {/* right section of the header's top layer */}
        <div className={classes.headerTopLayerRight}>
          {/* localeLanguage */}
          <div className={classes.localeArea}></div>
          {/* token ? profile: LoginBtn */}
          <div className={classes.localeArea}></div>
        </div>
      </div>
      <div className={classes.drawALine}></div>
      {/* Bottom layer of the PC header */}
      <div className={classes.headerBottomLayer}>
        <Logo />
        <div className={classes.menuArea}>
          {/* Menu */}
          <div className={classes.optionArea}>
            {headerMenuList.map((item, index) => {
              return (
                <Link href={item.key} key={item.key}>
                  <div
                    style={{
                      color:
                        router.pathname === item.pathname
                          ? "var(--text-second-color)"
                          : "",
                    }}
                    className={classes.optionItem}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className={classes.web3BtnBox}>
            <div>
              {chainId !== chainInfo.id && chainId ? (
                <div
                  className={`${"switchNetworksBtn"} ${classes.switchNetworksBtn}`}
                  onClick={async () => {
                    // console.log(chainInfo.id);
                    // console.log(Number(chainInfo.id).toString(16));
                    // console.log(ethers.utils.hexlify(chainInfo.id));
                    // console.log(ethers.utils.hexlify(97));
                    // console.log(ethers.utils.hexStripZeros(ethers.utils.hexlify(chainInfo.id)));

                    await (window as any).ethereum.request({
                      method: "wallet_addEthereumChain",
                      params: [
                        {
                          chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chainInfo.id)),
                          rpcUrls: [chainInfo.rpcUrls.default.http[0]],
                          chainName: chainInfo.name,
                          nativeCurrency: {
                            name: chainInfo.nativeCurrency.symbol,
                            symbol: chainInfo.nativeCurrency.symbol,
                            decimals: 18,
                          },
                          blockExplorerUrls: [chainInfo.blockExplorers?.default?.url],
                        },
                      ],
                    });
                    // document.location.reload()
                  }}
                >
                  Switch to {chainInfo.name}
                </div>
              ) : (
                ""
              )}
            </div>
            {!chain
              ? show && (
                <div
                  className="connectWalletBtn"
                  onClick={() => {
                    web3modal.open();
                  }}
                >
                  Connect Wallet
                </div>
              )
              : show && <>
                <w3m-button />
              </>}
          </div>
        </div>
      </div>
    </div >
  );
};
export default PcHeadr;
