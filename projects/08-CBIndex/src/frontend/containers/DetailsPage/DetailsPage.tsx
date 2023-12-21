import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getVaultsDetailsApi,
  getVaultsPortfolioApi,
  getActiveListApi,
  getDepositorApi,
} from "../../src/pages/api/api";
import {
  Button,
  InputNumber,
  Tabs,
  Avatar,
  Modal,
  Spin,
  Segmented,
  Select,
  Space,
  Slider,
  Checkbox,
} from "antd";
import {
  ArrowLeftOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  createWalletClient,
  custom,
  createPublicClient,
  defineChain,
} from "viem";
import GuardianLogic from "../../ABI/GuardianLogic.json";
import { ethers } from "ethers";
import { ServerAssetes } from "../../utils/consts/Consts";
import { erc20ABI, useNetwork, useWaitForTransaction, useAccount } from "wagmi";
import SwapPage from "../SwapPage/SwapPage";
import classes from "./style.module.less";
import AssetTable from "../../components/TableType/AssetTable/AssetTable";
import icon from "../../utils/TokenIcon/Icon.json";
import { getTimeDistanceFromNow } from "../../utils/Time/getTimeDistanceFromNow";
import DepositorTable from "../../components/DepositorTable/DepositorTable";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import Chart from "../../components/Chart/Chart";
import { vaultLineDataApi } from "../../src/pages/api/api";
import formatMoney from "../../utils/Number/formatMoney";
import { DownCircleOutlined } from "@ant-design/icons";
import ActiveTable from "../../components/TableType/ActivityTable/ActivityTable";
let walletClient: any;
let address: any = [0];
let publicClient: any;
import Image from "next/image";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import ValueEvaluator from "../../ABI/ValueEvaluator.json";
import { getImageUrl } from '../../utils/TokenIcon/getIconImage'
const marks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};
const flot = 1;
const DetailsPage = () => {
  let DAIToken = JSON.parse(localStorage.getItem("DAIToken") as any);
  let AdapterAddress = JSON.parse(
    localStorage.getItem("AdapterAddress") as any
  );
  let IntegrationManagerAddress = JSON.parse(
    localStorage.getItem("IntegrationManagerAddress") as any
  );

  const { chain, chains } = useNetwork();
  const router = useRouter();
  const web3modal = useWeb3Modal();
  const [guardianAddress, setGuardianAddress] = useState("");
  const [assetList, setAssetList] = useState([]);
  const [vaultInfo, setVaultInfo] = useState({} as any);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [DepositorList, setDepositorList] = useState([]);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [assetBalance, setAssetBalance] = useState("");
  const [depositNum, setDepositNum] = useState("0");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawNum, setWithdrawNum] = useState("0");
  const [hash, setHash] = useState("" as any);
  const [vaultsAum, setVaultsAum] = useState("0");
  const [vaultsNav, setVaultsNav] = useState("0");
  const [myShares, setMyShares] = useState("0" as any);
  const [time, setTime] = useState("1d");
  const [errorModal, setErrorModal] = useState(false);
  const [errrorMessage, setErrorMessage] = useState({} as any);
  const [aumSeries, setAumSeries] = useState([] as any);
  const [navSeries, setNavSeries] = useState([] as any);
  const [lineData, setLineData] = useState([] as any);
  const [activityList, setActivityList] = useState([] as any);
  const [filterOperation, setFilterOperation] = useState("");
  const [chainId, setChainId] = useState(0);
  const [assetBalanceMap, setAssetBalanceMap] = useState({} as any)
  const [surplusWithdrawAmmount, setSurplusWithdrawAmmount] = useState(0)
  const [modalOkLoading, setModalOkLoading] = useState(false)
  const [buyToken, setBuyToken] = useState({
    address: "",
    label: "",
    amount: "0",
  });
  const [sellToken, setSellToken] = useState({
    address: "",
    label: "",
    amount: "0",
  });
  const [page, setPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const [swapLoading, setSwapLoading] = useState(false)
  const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
    cacheTime: 5000,
  });
  const [chainInfo, setChainInfo] = useState({} as any);
  const [disabledBalance, setDisabledBalance] = useState(0);
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
    setChainInfo(chain);
    walletClient = createWalletClient({
      chain: chain,
      transport: custom(window.ethereum as any),
    });
    publicClient = createPublicClient({
      chain: chain,
      transport: custom(window.ethereum as any),
    });
    address = await walletClient.getAddresses();
    localStorage.setItem("address", JSON.stringify(address));
    requireListApi(
      data.valueEvaluatorAddress,
      data.availableTokens,
      data.chainConf.chainId
    );
  };
  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady, chainId]);
  useEffect(() => {
    if (chain) {
      setChainId(chain.id);
    } else {
      setChainId(0);
    }
  }, [chain]);
  useEffect(() => {
    vaultLineDataApi(router.query.vaultAddress, time).then((d) => {
      if (!d.data.items) {
        setAumSeries([] as any);
        setNavSeries([] as any);
        setLineData([] as any);
        return;
      }
      let aum = [];
      let nav = [];
      for (let i = 0; i < d.data.items.length; i++) {
        aum.push({
          time: new Date(d.data.items[i].recordTime).getTime() / 1000,
          value: Number(d.data.items[i].aum),
        });
        nav.push({
          time: new Date(d.data.items[i].recordTime).getTime() / 1000,
          value: Number(d.data.items[i].nav),
        });
      }
      setAumSeries(aum);
      setLineData(aum);
      setNavSeries(nav);
    });
  }, [time]);

  useEffect(() => {
    if (guardianAddress) {
      getActiveListApi(guardianAddress, filterOperation, page).then((f) => {
        if (f.data.items) {
          setActivityList(f.data.items);
          setActivityTotal(f.data.total);
        }
      });
    }
  }, [filterOperation, guardianAddress]);
  useEffect(() => {
    if (page !== 1) {
      if (guardianAddress) {
        getActiveListApi(guardianAddress, filterOperation, page).then((f) => {
          setActivityList([...activityList, ...f.data.items]);
        });
      }
    }
  }, [page]);
  // 获取列表数据
  const requireListApi = async (
    evaluatorAddress: string,
    tokenList: any,
    id: string
  ) => {
    let address = await walletClient.getAddresses();
    getVaultsDetailsApi(router.query.vaultAddress).then((d) => {
      getActiveListApi(d.data.guardianAddress, filterOperation, page).then(
        (f) => {
          if (f.data.items) {
            setActivityList(f.data.items);
            setActivityTotal(f.data.total);
          }
        }
      );
      setVaultInfo(d.data);
      setGuardianAddress(d.data.guardianAddress);
      // 资产列表
      getVaultsPortfolioApi(d.data.guardianAddress).then(async (e) => {
        let tempt = {} as any;
        let smallNum = 0;
        for (let i = 0; i < e.data.length; i++) {
          let SwapDAI = 0;
          let swapDaiTAmount = 0;
          if (Number(chainId) === Number(id)) {
            SwapDAI = await publicClient.readContract({
              address: evaluatorAddress,
              abi: ValueEvaluator,
              functionName: "calcCanonicalAssetValue",
              account: address[0],
              args: [
                tokenList["DAI"].address,
                ethers.utils.parseEther(String(1)),
                e.data[i].assetAddress,
              ],
            });
            swapDaiTAmount = await publicClient.readContract({
              address: evaluatorAddress,
              abi: ValueEvaluator,
              functionName: "calcCanonicalAssetValue",
              account: address[0],
              args: [
                e.data[i].assetAddress,
                ethers.utils.parseEther(String(e.data[i].balance)),
                tokenList["DAI"].address,
              ],
            });
          }
          if (Number(ethers.utils.formatEther(swapDaiTAmount)) < 10) {
            smallNum =
              smallNum + Number(ethers.utils.formatEther(swapDaiTAmount));
          }
          tempt[e.data[i].asset.symbol] = {
            balance: e.data[i].balance,
            status: false,
            address: e.data[i].assetAddress,
            daiSwapAmmount: ethers.utils.formatEther(SwapDAI),
            withdrawAmmount: 0,
            swapDaiTAmount: ethers.utils.formatEther(swapDaiTAmount),
          };
        }
        setDisabledBalance(smallNum);
        setAssetBalanceMap(tempt);
        setAssetList(e.data);
        // 投资者列表
        getDepositorApi(router.query.vaultAddress).then((g) => {
          setDepositorList(g.data.items);
        });
      });
    });
  };
  //deposit Contract Evt
  const deposit = async () => {
    setModalOkLoading(true)
    try {
      const approve = await walletClient.writeContract({
        address: DAIToken.address,
        abi: erc20ABI,
        functionName: "approve",
        args: [guardianAddress, ethers.utils.parseEther(depositNum)],
        account: address[0],
      });
      const depositHash = await walletClient.writeContract({
        address: guardianAddress,
        abi: GuardianLogic,
        functionName: "buyShares",
        args: [ethers.utils.parseEther(depositNum), 100],
        account: address[0],
        gas: 5000000,
      });
      setHash(depositHash);
      setModalOkLoading(false)
    } catch (e) {
      setModalOkLoading(false)
      setErrorModal(true);
      setErrorMessage(JSON.parse(JSON.stringify(e)));
    }
  };

  const initWithdrawFuc = (array: any) => {
    let obj = { tokenAddress: [], proportion: [] } as any;
    for (let i = 0; i < array.length; i++) {
      obj.tokenAddress.push(array[i].key);
      obj.proportion.push(array[i].amount);
    }
    return obj;
  };
  const ifWithdrawMax = (map: any) => {
    for (let key in map) {
      if (map[key].withdrawAmmount) {
        if (map[key].withdrawAmmount !== map[key].max) {
          return key;
        }
      }
    }
  };
  const initNumber = (num: any) => {
    if (String(num).includes(".")) {
      return Number(String(num * 10000).split(".")[0]);
    } else {
      return Number(num * 10000);
    }
  };
  const differenceValueFuc = (map: any) => {
    let num = 0;
    for (let key in map) {
      if (
        String(
          (map[key].withdrawAmmount /
            map[key].daiSwapAmmount /
            Number(withdrawNum)) *
          10000
        ).includes(".")
      ) {
        num =
          Number(num) +
          Number(
            "0." +
            String(
              (map[key].withdrawAmmount /
                map[key].daiSwapAmmount /
                Number(withdrawNum)) *
              10000
            ).split(".")[1]
          );
      } else {
        num = num + 0;
      }
    }
    return Number(num.toFixed(0));
  };
  //withdraw Contract Evt
  const withdraw = async () => {
    setModalOkLoading(true)
    let init = [];
    let noMaxTokenKey = ifWithdrawMax(assetBalanceMap);
    let chazhi = differenceValueFuc(assetBalanceMap);
    for (let key in assetBalanceMap) {
      if (assetBalanceMap[key].status && assetBalanceMap[key].withdrawAmmount) {
        if (noMaxTokenKey === key) {
          init.push({
            amount:
              initNumber(
                Number(
                  assetBalanceMap[key].withdrawAmmount /
                  assetBalanceMap[key].daiSwapAmmount
                ) / Number(withdrawNum)
              ) + chazhi,
            key: assetBalanceMap[key].address,
          });
        } else {
          init.push({
            amount: initNumber(
              Number(
                assetBalanceMap[key].withdrawAmmount /
                assetBalanceMap[key].daiSwapAmmount
              ) / Number(withdrawNum)
            ),
            key: assetBalanceMap[key].address,
          });
        }
      }
    }
    try {
      let num = !disabledBalance ? 10 : disabledBalance;
      let withdrawShares =
        Number(Number(withdrawNum) - num) / Number(vaultsNav);
      const withdrawHash = await walletClient.writeContract({
        address: guardianAddress,
        abi: GuardianLogic,
        functionName: "redeemSharesForSpecificAssets",
        args: [
          address[0],
          ethers.utils.parseEther(String(withdrawShares)),
          [...initWithdrawFuc(init).tokenAddress],
          [...initWithdrawFuc(init).proportion],
        ],
        account: address[0],
        gas: 5000000,
      });
      setHash(withdrawHash);
      setModalOkLoading(false)
    } catch (e) {
      setErrorModal(true);
      setModalOkLoading(false)
      setErrorMessage(JSON.parse(JSON.stringify(e)));
    }
  };

  // swap Contract Evt
  const swap = async (sell: any, buy: any) => {
    if (
      !sell.address ||
      !sell.amount ||
      !sell.label ||
      !buy.address ||
      !buy.amount ||
      !buy.label
    )
      return;
    setSwapLoading(true)
    setBuyToken(buy);
    setSellToken(sell);
    let swapArray = [];
    if (sell.address === DAIToken.address || buy.address === DAIToken.address) {
      swapArray = [sell.address, buy.address];
    } else {
      swapArray = [sell.address, DAIToken.address, buy.address];
    }
    const dataBytes = ethers.utils.defaultAbiCoder.encode(
      ["address[]", "uint256", "uint256"],
      [
        swapArray,
        ethers.utils.parseEther(sell.amount),
        ethers.utils.parseEther(String(buy.amount * 0.95)),
      ]
    );
    let selector = ethers.utils.hexDataSlice(
      ethers.utils.id("takeOrder(address,bytes,bytes)"),
      0,
      4
    );
    const _callArgs = ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes4", "bytes"],
      [AdapterAddress.address, selector, dataBytes]
    );
    try {
      const swapHash = await walletClient.writeContract({
        address: guardianAddress,
        abi: GuardianLogic,
        functionName: "callOnExtension",
        args: [IntegrationManagerAddress.address, 0, _callArgs],
        account: address[0],
        gas: 8000000,
      });
      setHash(swapHash);
      setSwapLoading(false)
    } catch (e) {
      setErrorModal(true);
      setSwapLoading(false);
      setErrorMessage(JSON.parse(JSON.stringify(e)));
    }
  };

  const onChange = (key: string) => { };

  const handleChange = (value: any) => {
    setTime(value);
  };

  const items = [
    {
      key: "1",
      label: "Chart",
      children: (
        <div>
          <Space wrap>
            <Segmented
              defaultValue={"aum"}
              options={[
                { label: "Aum", value: "aum" },
                { label: "Nav", value: "nav" },
              ]}
              onChange={(v) => {
                switch (v) {
                  case "aum":
                    setLineData(aumSeries);
                    break;
                  case "nav":
                    setLineData(navSeries);
                    break;
                }
              }}
            />
            <Select
              defaultValue="1d"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "1d", label: "1 Day" },
                { value: "7d", label: "1 Week" },
                { value: "30d", label: "30 Days" },
                { value: "180d", label: "180 Days" },
                { value: "365d", label: "1 Year" },
              ]}
            />
          </Space>
          <Chart lineData={lineData} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Assets",
      children: <AssetTable assetList={assetList} />,
    },
    {
      key: "3",
      label: "Investors",
      children: <DepositorTable DepositorList={DepositorList} />,
    },
    {
      key: "4",
      label: "Activities",
      children: (
        <div>
          <Space
            wrap
            style={{
              marginBottom: "16px",
            }}
          >
            <div
              className={`plainBtn ${"Deposit" === filterOperation && "plainBtnActive"
                }`}
              onClick={() => {
                if (filterOperation === "Deposit") {
                  setFilterOperation("");
                  return;
                }
                setFilterOperation("Deposit");
              }}
            >
              Deposit
            </div>
            <div
              className={`plainBtn ${"Redemption" === filterOperation && "plainBtnActive"
                }`}
              onClick={() => {
                if (filterOperation === "Redemption") {
                  setFilterOperation("");
                  return;
                }
                setFilterOperation("Redemption");
              }}
            >
              Redemption
            </div>
            <div
              className={`plainBtn ${"Swap" === filterOperation && "plainBtnActive"
                }`}
              onClick={() => {
                if (filterOperation === "Swap") {
                  setFilterOperation("");
                  return;
                }
                setFilterOperation("Swap");
              }}
            >
              Swap
            </div>
          </Space>
          <ActiveTable activityList={activityList} vaultInfo={vaultInfo} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {activityTotal !== activityList.length && (
              <Button
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      init();
    }
  }, [isSuccess]);
  // Redeem Btn Evt
  const clickRedeemBtnEvt = async () => {
    setHash("");
    try {
      if (!chainId) {
        web3modal.open();
        return;
      }
      if (chainId !== chainInfo.id) {
        checkNetWork();
        return;
      }
      const myShares = await publicClient.readContract({
        address: router.query.vaultAddress,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address[0]],
      });
      const nav = await publicClient.readContract({
        address: guardianAddress,
        abi: GuardianLogic,
        functionName: "calcNav",
      });
      const aum = await publicClient.readContract({
        address: guardianAddress,
        abi: GuardianLogic,
        functionName: "calcAum",
      });
      // console.log(ethers.utils.formatEther(myShares), ethers.utils.formatEther(nav), ethers.utils.formatEther(aum));
      setVaultsAum(ethers.utils.formatEther(aum));
      setWithdrawModalOpen(true);
      if (Number(ethers.utils.formatEther(aum)) < 10) {
        setVaultsNav("0");
        setMyShares("0");
        setDisabledBalance(0);
      } else {
        setVaultsNav(ethers.utils.formatEther(nav));
        setMyShares(ethers.utils.formatEther(myShares));
      }
    } catch (e) {
      setErrorModal(true);
      setErrorMessage(JSON.parse(JSON.stringify(e)));
    }
  };

  // Invest Btn Evt
  const clickInvestBtnEvt = async () => {
    try {
      if (!chainId) {
        web3modal.open();
        return;
      }
      if (chainId !== chainInfo.id) {
        checkNetWork();
        return;
      }
      setHash("");
      const mybalance = await publicClient.readContract({
        address: DAIToken.address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address[0]],
      });
      setAssetBalance(ethers.utils.formatEther(mybalance));
      setDepositModalOpen(true);
    } catch (e) { }
  };

  // Swap Btn Evt
  const clickSwapBtnEvt = async () => {
    setHash("");
    if (!chainId) {
      web3modal.open();
      return;
    }
    if (chainId !== chainInfo.id) {
      checkNetWork();
      return;
    }

    setSwapModalOpen(true);
  };

  // switch NetWork
  const checkNetWork = async () => {
    await (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chainInfo.id)),
          rpcUrls: [chainInfo.rpcUrls.default.http[0]],
          chainName: chainInfo.name,
          nativeCurrency: {
            name: chainInfo.nativeCurrency.name,
            symbol: chainInfo.nativeCurrency.name,
            decimals: 18,
          },
          blockExplorerUrls: [chainInfo.blockExplorers.default.url],
        },
      ],
    });
    return;
  };

  // select Withdraw AssetEvt
  const selectAssetEvt = (key: any, e: any, balance: any) => {
    assetBalanceMap[key].status = e.target.checked;
    if (e.target.checked) {
      if (
        balance / assetBalanceMap[key].daiSwapAmmount >
        surplusWithdrawAmmount
      ) {
        assetBalanceMap[key].withdrawAmmount =
          surplusWithdrawAmmount * assetBalanceMap[key].daiSwapAmmount;
      } else {
        assetBalanceMap[key].withdrawAmmount = balance;
      }
    } else {
      assetBalanceMap[key].withdrawAmmount = 0;
    }
    setSurplusWithdrawAmmount(subtractFuc(assetBalanceMap));
    setAssetBalanceMap({ ...assetBalanceMap });
  };
  // set withdraw Max
  useEffect(() => {
    if (Number(withdrawNum) !== 0) {
      let tempt = {} as any;
      for (let key in assetBalanceMap) {
        if (
          Number(assetBalanceMap[key].balance) <
          Number(withdrawNum) * assetBalanceMap[key].daiSwapAmmount
        ) {
          tempt[key] = {
            ...assetBalanceMap[key],
            max: assetBalanceMap[key].balance,
            status: false,
            withdrawAmmount: 0,
          };
        } else {
          tempt[key] = {
            ...assetBalanceMap[key],
            max: Number(withdrawNum) * assetBalanceMap[key].daiSwapAmmount,
            status: false,
            withdrawAmmount: 0,
          };
        }
      }
      setSurplusWithdrawAmmount(subtractFuc(tempt));
      setAssetBalanceMap(tempt);
    } else {
      for (let key in assetBalanceMap) {
        assetBalanceMap[key].max = 0;
      }
      setSurplusWithdrawAmmount(0);
      setAssetBalanceMap({ ...assetBalanceMap });
    }
  }, [withdrawNum]);

  /**返回当前币种能购买的DAI的数量 */
  const subtractFuc = (map: any) => {
    let total = 0;
    for (let key in map) {
      if (map[key].status) {
        total = total + map[key].withdrawAmmount / map[key].daiSwapAmmount;
      }
    }
    return Number(withdrawNum) - total;
  };

  return (
    <>
      {/* Swap Modal */}
      <Modal
        open={swapModalOpen}
        onCancel={() => {
          setSwapModalOpen(false);
          setSwapLoading(false)
        }}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        maskClosable={false}
      >
        {isLoading && (
          <div className={classes.swapLoaidng}>
            <div>
              <Spin />
            </div>
            <div
              style={{
                marginTop: "var(--margin-sm)",
              }}
            >
              Swaping...
            </div>
          </div>
        )}
        {!isLoading && !isSuccess && (
          <SwapPage swap={swap} assetList={assetList} swapLoading={swapLoading} />
        )}
        {isSuccess && (
          <div>
            <>
              {" "}
              <>
                <div
                  className="text-textLightGray"
                  style={{ marginLeft: "6px" }}
                >
                  Swap Successfully Completed!
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      margin: "48px 0",
                      padding: "0 8px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2px 4px",
                        borderRadius: "8px",
                        backgroundColor: "rgb(135,61,61)",
                      }}
                    >
                      -{Number(sellToken.amount).toFixed(8)} {sellToken.label}
                      <Avatar
                        style={{ margin: "4px" }}
                        src={`${ServerAssetes.Icon + getImageUrl(sellToken?.label)}`}
                      />
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgb(118,128,143)",
                        fontSize: "24px",
                        margin: "12px",
                      }}
                    >
                      <DownCircleOutlined />
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2px 4px",
                        borderRadius: "8px",
                        backgroundColor: "rgb(9,138,18)",
                      }}
                    >
                      +{Number(buyToken.amount).toFixed(8)} {buyToken.label}
                      <Avatar
                        style={{ margin: "4px" }}
                        src={`${ServerAssetes.Icon + getImageUrl(buyToken?.label)}`}
                      />
                    </span>
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    style={{
                      width: "100%",
                      borderRadius: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    Close
                  </Button>
                </div>
              </>
            </>
          </div>
        )}
      </Modal>
      {/* deposit Modal*/}
      <Modal
        open={depositModalOpen}
        maskClosable={false}
        onCancel={() => {
          setDepositModalOpen(false)
          setModalOkLoading(false)
        }}
        okButtonProps={{
          disabled:
            Number(assetBalance) === 0 ||
            Number(depositNum) === 0 ||
            Number(depositNum) > Number(assetBalance),
          style: {
            display: isLoading ? "none" : "",
          },
        }}
        cancelButtonProps={{
          style: {
            display: isLoading ? "none" : "",
          },
        }}
        confirmLoading={modalOkLoading}
        onOk={() => {
          if (isSuccess) {
            setDepositModalOpen(false);
            return;
          }
          deposit();
        }}
      >
        <div>
          {!isSuccess && !isLoading && (
            <>
              <div className={classes.investModalTitle}>
                Invest in this fund
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <InputNumber
                  min={0}
                  max={Number(assetBalance)}
                  onChange={(v: any) => {
                    setDepositNum(String(v));
                  }}
                />
                <span>Wallet Balance: {formatMoney(assetBalance)} DAI</span>
              </div>
            </>
          )}
        </div>
        <div>
          {isLoading && (
            <div className={classes.swapLoaidng}>
              <div>
                <Spin />
              </div>
              <div
                style={{
                  marginTop: "var(--margin-sm)",
                }}
              >
                Depositing in fund...
              </div>
            </div>
          )}
        </div>
        <div>{isSuccess && <>Successfully deposited!</>}</div>
      </Modal>
      {/* withdraw Modal */}
      <Modal
        maskClosable={false}
        open={withdrawModalOpen}
        onCancel={() => {
          setModalOkLoading(false)
          setWithdrawModalOpen(false)
          setWithdrawNum("0")
        }}
        onOk={() => {
          if (isSuccess) {
            setWithdrawModalOpen(false);
            return;
          }

          withdraw();
        }}
        okButtonProps={{
          disabled:
            Number(myShares) === 0 ||
            Number(withdrawNum) === 0 ||
            Number(withdrawNum) > Number(myShares * Number(vaultsNav)) ||
            Number(surplusWithdrawAmmount) !== 0,
          style: {
            display: isLoading ? "none" : "",
          },
        }}
        confirmLoading={modalOkLoading}
        cancelButtonProps={{
          style: {
            display: isLoading ? "none" : "",
          },
        }}
      >
        {!isLoading && !isSuccess && (
          <>
            <div className={classes.investModalTitle}>
              Redeem from this fund
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                <div style={{ marginBottom: "var(--margin-md)" }}>
                  My Balance:{" "}
                  {formatMoney(
                    Number(
                      myShares * Number(vaultsNav) - disabledBalance
                    ).toFixed(2)
                  )}{" "}
                  DAI
                </div>
                <div>
                  <Slider
                    marks={marks}
                    value={
                      (Number(withdrawNum) /
                        (myShares * Number(vaultsNav) - disabledBalance)) *
                      100.5
                    }
                    step={1}
                    onChange={(e) => {
                      setWithdrawNum(
                        String(
                          (e / 100.5) * (myShares * Number(vaultsNav)) -
                          disabledBalance
                        )
                      );
                    }}
                  />
                  Redeem Size:{" "}
                  <InputNumber
                    min={0}
                    value={Number(withdrawNum)}
                    style={{ margin: "var(--margin-md) var(--margin-sm) 0 0" }}
                    onChange={(v: any) => {
                      setWithdrawNum(String(v));
                    }}
                  />
                  <div style={{ marginTop: "var(--margin-sm)" }}>
                    Select Token
                    {Object.entries(assetBalanceMap).map(([key, obj]: any) => {
                      return (
                        <>
                          {obj.balance / obj.daiSwapAmmount > 10 && (
                            <div>
                              <Checkbox
                                disabled={
                                  surplusWithdrawAmmount === 0 &&
                                  obj.withdrawAmmount === 0
                                }
                                checked={obj.status}
                                onChange={(e) =>
                                  selectAssetEvt(key, e, obj.balance)
                                }
                                style={{ marginRight: "var(--margin-sm)" }}
                              />
                              {key}, Fund Balance:{" "}
                              {(obj.balance / obj.daiSwapAmmount).toFixed(2)},
                              Redeem: {""}
                              {(
                                obj.withdrawAmmount / obj.daiSwapAmmount
                              ).toFixed(2)}
                            </div>
                          )}
                        </>
                      );
                    })}
                    <div
                      style={{
                        marginTop: "var(--margin-sm)",
                        color: "var(--text-third-color) ",
                      }}
                    >
                      Redeem Size Balance:{" "}
                      {Number(surplusWithdrawAmmount.toFixed(2))} DAI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {isLoading && (
          <div className={classes.swapLoaidng}>
            <div>
              <Spin />
            </div>
            <div
              style={{
                marginTop: "var(--margin-sm)",
              }}
            >
              Redeeming from fund...
            </div>
          </div>
        )}
        {isSuccess && <>Successfully redeemed!</>}
      </Modal>
      {/* Error Modal */}
      <ErrorModal
        maskClosable={false}
        setErrorModal={setErrorModal}
        errorModal={errorModal}
        errrorMessage={errrorMessage}
      />
      <div className={classes.detailsPageContainer}>
        <div className={classes.backArea}>
          <ArrowLeftOutlined
            style={{
              fontSize: "20px",
              color: "var(--text-third-color)",
              cursor: "pointer",
              marginRight: "16px",
            }}
            onClick={() => router.back()}
          />
          <span
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "var(--text-third-color)",
            }}
          >
            Fund Detail
          </span>
        </div>
        <div className={classes.detailsHeadedr}>
          <div className={classes.dedtailsHeaderLeft}>
            <div className={classes.fundName}>
              {/* Fund Name */}
              {vaultInfo.name}
            </div>
            <div className={classes.walletAddrAera}>
              <span className={classes.walletAddr}>{vaultInfo.owner}</span>
              <span className={classes.ownerSpan}>Fund Creator & Manager</span>
            </div>
          </div>
          <div className={classes.dedtailsHeaderRight}>
            <div
              onClick={async () => clickInvestBtnEvt()}
              className="switchNetworksBtn"
            >
              <VerticalAlignBottomOutlined />
              <span className={classes.headerRightTitle}>Invest</span>
            </div>
            <div
              onClick={async () => clickRedeemBtnEvt()}
              style={{
                marginRight: "6px",
                marginLeft: "6px",
              }}
              className="switchNetworksBtn"
            >
              <VerticalAlignTopOutlined />
              <span className={classes.headerRightTitle}>Reddeem</span>
            </div>
            {address[0] === vaultInfo.owner && (
              <div
                onClick={() => clickSwapBtnEvt()}
                className="switchNetworksBtn"
              >
                <SwapOutlined />
                <span className={classes.headerRightTitle}>Swap</span>
              </div>
            )}
          </div>
        </div>
        <div className={classes.card_area}>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              {vaultInfo.performance?.aum
                ? formatMoney(Number(vaultInfo.performance?.aum).toFixed(2))
                : 0}
            </div>
            <div className={classes.infoCardTitle}>AUM(USD)</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>{DepositorList.length}</div>
            <div className={classes.infoCardTitle}>Investor</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              {vaultInfo.denominationAsset?.symbol}
              <div className={classes.assetLogo}>
                <Image
                  src={`${ServerAssetes.Icon + getImageUrl(vaultInfo.denominationAsset?.symbol)}`}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </div>
            </div>
            <div className={classes.infoCardTitle}>Denomination Asset</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              {getTimeDistanceFromNow(vaultInfo?.createdAt)}
            </div>
            <div className={classes.infoCardTitle}>Since Inception</div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </>
  );
};

export default DetailsPage;
