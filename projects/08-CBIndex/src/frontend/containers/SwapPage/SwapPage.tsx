import React, { useEffect, useState } from "react";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Route, Pair, Trade } from "@uniswap/v2-sdk";
import { ethers } from "ethers";
import IUniswapV2Pair from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import { Button, Select, InputNumber } from "antd";
import classes from "./style.module.less";
import { ArrowDownOutlined } from "@ant-design/icons";
import formatMoney from "../../utils/Number/formatMoney";
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { defineChain } from "viem";

const SwapPage = ({ swap, assetList, swapLoading }: any) => {
  let DAIToken = JSON.parse(localStorage.getItem("DAIToken") as any)
  const DAI = new Token(1001, DAIToken.address, 18, DAIToken.name, DAIToken.name);
  let WethToken = JSON.parse(localStorage.getItem("WethToken") as any)
  let WBTCToken = JSON.parse(localStorage.getItem("WBTCToken") as any)
  let WSOLToken = JSON.parse(localStorage.getItem("WSOLToken") as any)
  const option = [
    { value: DAIToken.address, label: DAIToken.symbol },
    { value: WethToken.address, label: WethToken.symbol },
    // { value: WKLAYToken.address, label: WKLAYToken.symbol },
    { value: WBTCToken.address, label: WBTCToken.symbol },
    { value: WSOLToken.address, label: WSOLToken.symbol },
  ];

  if (JSON.parse(localStorage.getItem("chainInfo") as any).nativeToken.supportSwap) {
    option.push({ value: JSON.parse(localStorage.getItem("chainInfo") as any).nativeToken.wrappedTokenAddress, label: JSON.parse(localStorage.getItem("chainInfo") as any).nativeToken.symbol })
  }
  let FactoryAddress = JSON.parse(localStorage.getItem("FactoryAddress") as any)


  const [sell, setSell] = useState({
    address: DAIToken.address,
    label: DAIToken.name,
    amount: "0",
  } as any);
  const [buy, setBuy] = useState({ address: "", label: "", amount: "0" });
  const [switchStatus, setSwitchStatus] = useState(false);
  const [assetListMap, setAssetListMap] = useState({} as any);
  const [chainInfo, setChainInfo] = useState({} as any)

  const init = async () => {
    const data = JSON.parse(localStorage.getItem("chainInfo") as any)
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

  useEffect(() => {
    let obj = {} as any;
    for (let i = 0; i < assetList.length; i++) {
      obj[assetList[i].asset.symbol] = assetList[i].balance;
    }
    setAssetListMap(obj);
  }, [assetList]);
  // 
  const checkPairAddress = (sellToken: any, buyToken: any) => {
    const tokens = [sellToken, buyToken];
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]];
    const pair = getCreate2Address(
      FactoryAddress.address,
      keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
      "0x" + "1f1c636a3d59823e4a1dabeee6eefe8405576b27d7d5b7983cc008ac189fb780"
    )
    return pair
  };
  // Create a pair and get the price
  async function createPair(sellToken: any, buyToken: any): Promise<Pair> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        chainInfo.rpcUrls.default.http[0],
        {
          name: chainInfo.name,
          chainId: chainInfo.id,
        }
      );
      const pairContract = new ethers.Contract(
        checkPairAddress(sellToken, buyToken) as any,
        IUniswapV2Pair.abi,
        provider
      );
      const reserves = await pairContract["getReserves"]();
      const [reserve0, reserve1] = reserves;
      const tokens = [sellToken, buyToken];
      const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]];
      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0),
        CurrencyAmount.fromRawAmount(token1, reserve1)
      );
      return pair;
    } catch (e) {
      return Promise.reject(e);
    }
  }
  // Create a route and get the price
  async function createRoute(sellToken: any, buyToken: any, type: any, amount: any) {
    if (sell.amount === "0") return;
    let prir = await createPair(sellToken, buyToken);

    const route = new Route([prir], sellToken, buyToken);

    const trade = new Trade(
      route,
      CurrencyAmount.fromRawAmount(
        sellToken,
        ethers.utils.parseEther(amount) as any
      ),
      TradeType.EXACT_INPUT
    );
    if (type) {
      setBuy({ ...buy, amount: trade.outputAmount.toSignificant(6) });
      return;
    }
    return trade.outputAmount.toSignificant(6);
  }
  const async = async (sell: any, buy: any) => {
    if (!sell.address || !buy.address) return;
    if (sell.address === DAIToken.address || buy.address === DAIToken.address) {
      const sellToken = new Token(
        1001,
        sell.address,
        18,
        sell.label,
        sell.label
      );

      const buyToken = new Token(1001, buy.address, 18, buy.label, buy.label);
      try {
        await createRoute(sellToken, buyToken, true, sell.amount);
      } catch (e) {
      }
    } else {
      const sellToken = new Token(1001, sell.address, 18, sell.label, sell.label);
      const buyToken = new Token(1001, buy.address, 18, buy.label, buy.label);
      let sellAmount = await createRoute(sellToken, DAI, false, sell.amount);
      let buyAmount = await createRoute(DAI, buyToken, false, sellAmount);
      setBuy({ ...buy, amount: String(Number(buyAmount)) });
    }
  };


  const switchSellBuy = () => {
    setBuy(sell);
    setSell(buy);
    setSwitchStatus(!switchStatus);
  };
  useEffect(() => {
    if (!sell.amount) return
    if (sell.amount === "0" || sell.amount == "null") {
      setBuy({ ...buy, amount: "0" });
      return;
    }
    async(sell, buy);
  }, [sell.amount, sell.address, buy.address]);

  return (
    <>
      <div className={classes.swapBox}>
        <div className={classes.swapBoxTitle}>Swap</div>
        <div>
          {/* sell */}
          <div className={classes.swapArea}>
            <div>You pay: {sell.amount}</div>
            <div className={classes.swapInputContainer}>
              <InputNumber
                bordered={false}
                controls={false}
                value={sell.amount}
                min={0}
                onChange={(v) => {
                  if (v === null) {
                    setSell({ ...sell, amount: "0" });
                    return
                  }
                  setSell({ ...sell, amount: String(v) });
                }}
                style={{ width: "200px", border: "none" }}
              />
              <Select
                style={{
                  width: "100px",
                  marginLeft: "10px",
                }}
                value={sell.address}
                defaultValue={DAIToken.address}
                options={option}
                onSelect={(v, label) => {
                  if (v === buy.address) {
                    switchSellBuy();
                    return;
                  }
                  setSell({ ...sell, address: v, label: label.label });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                }}
              >
                <span>
                  Fund Balance:{" "}
                  {assetListMap[sell.label]
                    ? formatMoney(assetListMap[sell.label])
                    : 0}
                  {Number(sell.amount) < Number(assetListMap[sell.label]) && <span style={{
                    color: "rgb(80, 246, 191)",
                    cursor: "pointer",
                    marginLeft: "5px"
                  }} onClick={() => {
                    if (!(assetListMap[sell.label])) return
                    setSell({ ...sell, amount: String(assetListMap[sell.label]) })
                  }}>Max</span>}
                </span>

              </div>
            </div>
          </div>
          {/* 切换 */}
          <div className={classes.down} onClick={() => switchSellBuy()}>
            <ArrowDownOutlined />
          </div>
          {/* buy */}
          <div>
            <div>You receive: {buy.amount}</div>
            <div className={classes.swapInputContainer}>
              <InputNumber
                bordered={false}
                controls={false}
                value={Number(buy.amount)}
                onChange={(v) => { }}
                style={{ width: "200px" }}
              />
              <Select
                style={{
                  width: "100px",
                  marginLeft: "10px",
                }}
                value={buy.address}
                options={option}
                onSelect={(v, label) => {
                  if (v === sell.address) {
                    switchSellBuy();
                    return;
                  }
                  setBuy({ ...buy, address: v, label: label.label });
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <Button
            loading={swapLoading}
            onClick={() => {
              swap(sell, buy);
            }}
            style={{ marginTop: "var(--margin-lg)" }}
            disabled={sell.amount === "0" || !assetListMap[sell.label] || (Number(sell.amount) > Number(assetListMap[sell.label]))}
          >
            Swap
          </Button>
        </div>
      </div >
    </>
  );
};
export default SwapPage;
