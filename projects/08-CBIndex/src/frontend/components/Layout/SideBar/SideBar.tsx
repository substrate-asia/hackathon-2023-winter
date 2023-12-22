import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classes from "./style.module.less";
import { claimFaucetApi } from "../../../src/pages/api/api";
import { Badge, Statistic, Modal, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAccount, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { defineChain } from "viem";
const { Countdown } = Statistic;
const SideBar = ({ }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [chainId, setChainId] = useState(0);
  const web3modal = useWeb3Modal();
  const [loading, setLoading] = useState(false)
  const [modalContentLoading, setModalContentLoading] = useState(false)
  const [message, setMessage] = useState({
    message: "",
    description: "",
    placement: "",
    icon: <></>
  })
  const [chainInfo, setChainInfo] = useState({} as any)
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
  const errorInfo = {
    message: "Notification",
    description: "Failed to claim faucet. Please try again later.",
    placement: "topRight",
    icon: (
      <>
        <ExclamationCircleOutlined style={{ color: "red", marginRight: "10px" }} />
      </>
    ),
  };
  const fuacetSuccess = {
    message: "Notification",
    description: "Successfully claimed 10,000 DAI. Now, you can make investments.",
    placement: "topRight",
    icon: (
      <>
        <CheckCircleOutlined style={{ color: "green", marginRight: "10px" }} />
      </>
    ),
  };
  useEffect(() => {
    if (chain) {
      setChainId(chain.id);
    } else {
      setChainId(0);
    }
  }, [chain]);
  const [menuStatus, setMenuStatus] = useState(true);
  const [list, setList] = useState([] as any);
  const [coolDown, setCoolDown] = useState(0);
  //url
  const linkUrlObj = {
    activefund: [
      {
        name: "Invest in Fund",
        url: "/activefund/vaults",
        pathname: "/activefund/[...page]",
      },
      {
        name: "Create Fund",
        url: "/activefund/createactivefund",
        pathname: "/activefund/[...page]",
      },
    ],
  };
  const router = useRouter();
  useEffect(() => {
    setMenuStatus(true);
    switch (router.pathname) {
      case '/activefund/[...page]':
        setList(linkUrlObj.activefund);
        break
      default:
        setMenuStatus(false);
    }
  }, [router.pathname]);
  const claimFaucet = async () => {
    if (address) {
      setLoading(true)
      setModalContentLoading(true)
      await claimFaucetApi(address).then((d) => {
        if (d.code !== 0) {
          setModalContentLoading(false)
          setMessage(errorInfo)
          return
        }
        setCoolDown(d.data.coolDown);
        if (d.data.ok) {
          setCoolDown(120);
          setMessage(fuacetSuccess)
          setModalContentLoading(false)
        } else {
          setModalContentLoading(false)
          setMessage(errorInfo)
        }
      });
    } else {
      web3modal.open();
    }
  };
  const selectUrlFuc = () => {
    if (router.asPath.includes('details')) {
      return router.asPath.split('/details')[0]
    } else {
      return router.asPath
    }
  }
  return (
    <>
      <Modal open={loading} closeIcon={false} onOk={() => {
        setLoading(false)
      }}
        okButtonProps={{
          style: {
            display: modalContentLoading ? "none" : ""
          }
        }}
        cancelButtonProps={{
          style: {
            display: "none"
          }
        }}
        centered
      >
        {modalContentLoading && <div className={classes.claimLoaidng}>
          <div>
            <Spin />
          </div>
          <div
            style={{
              marginTop: "var(--margin-sm)",
            }}
          >
            Claiming DAI...
          </div>
        </div>}
        {!modalContentLoading && <>
          <div className={classes.faucetSuccess}>
            {message.icon}
            {message.description}
          </div>
        </>
        }
      </Modal >
      {/* <Notification onRef={MyNotificationRef} /> */}
      {
        menuStatus && (
          <div className={classes.container}>
            <div className={classes.functionArea}>
              <div>
                {list.map((item: any) => (
                  <Link href={item.url} key={item.url}>
                    <div
                      style={{
                        color:
                          selectUrlFuc() === item.url
                            ? "#fff"
                            : "rgb(118,128,143)",
                        marginTop: "16px",
                      }}
                      key={item.name}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className={classes.fauceBtn}>
              <div className={`button`} onClick={() => claimFaucet()}>
                <Badge
                  offset={[24, -20]}
                  count={
                    <div>
                      {!coolDown ? (
                        <span
                          style={{
                            fontSize: "10px",
                            display: "flex",
                            padding: "2px 6px",
                          }}
                        >
                          Claimable
                        </span>
                      ) : (
                        <Countdown
                          value={Date.now() + coolDown * 1000}
                          format="HH:mm:ss"
                          valueStyle={{
                            color: "white",
                            fontSize: "10px",
                            display: "flex",
                            padding: "2px 6px",
                          }}
                        />
                      )}
                    </div>
                  }
                  style={{
                    backgroundColor: "rgb(253, 71, 71)",
                    opacity: "0.7",
                    borderRadius: "4px",
                    transform: "translateX(30%)",
                  }}
                >
                  Claim DAI
                </Badge>
              </div>
              <div
                className="button"
                style={{ marginTop: "16px" }}
                onClick={() => {
                  window.open(chainInfo.facuetsUrl);
                }}
              >
                Claim {chainInfo.nativeCurrency?.name}
              </div>
              <div
                className="button"
                style={{
                  marginTop: "16px",
                }}
                onClick={async () => {
                  const wasAdded = await (window as any).ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                      type: "ERC20",
                      options: {
                        address: JSON.parse(localStorage.getItem("DAIToken") as any).address, // The address of the token.
                        symbol: JSON.parse(localStorage.getItem("DAIToken") as any).symbol, // A ticker symbol or shorthand, up to 5 characters.
                        decimals: 18, // The number of decimals in the token.
                      },
                    },
                  });
                }}
              >
                Add DAI
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default SideBar;
