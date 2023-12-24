import type { AppProps } from "next/app";
import Layout from "../../components/Layout/Layout/Layout";
import { ConfigProvider, theme } from "antd";
import "../styles/global.css";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getvault_confApi } from "./api/api";
interface Token {
  address: string,
  name: string,
  symbol: string
}
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const DAIToken = {} as Token
  const FactoryAddress = {} as Token
  const WethToken = {} as Token
  const WBTCToken = {} as Token
  const WSOLToken = {} as Token
  const AdapterAddress = {} as any
  const VaultFactoryAddress = {} as any
  const IntegrationManagerAddress = {} as any
  const ValueEvaluatorAddress = {} as any
  const [show, setShow] = useState(false)
  const init = async () => {
    getvault_confApi().then(d => {
      localStorage.setItem("chainInfo", JSON.stringify(d.data))
      DAIToken.address = d.data.availableTokens.DAI.address
      DAIToken.name = d.data.availableTokens.DAI.symbol
      DAIToken.symbol = d.data.availableTokens.DAI.symbol
      localStorage.setItem("DAIToken", JSON.stringify(DAIToken))

      WethToken.address = d.data.availableTokens.WETH.address
      WethToken.name = d.data.availableTokens.WETH.symbol
      WethToken.symbol = d.data.availableTokens.WETH.symbol
      localStorage.setItem("WethToken", JSON.stringify(WethToken))

      WBTCToken.address = d.data.availableTokens.WBTC.address
      WBTCToken.name = d.data.availableTokens.WBTC.symbol
      WBTCToken.symbol = d.data.availableTokens.WBTC.symbol
      localStorage.setItem("WBTCToken", JSON.stringify(WBTCToken))

      WSOLToken.address = d.data.availableTokens.WSOL.address
      WSOLToken.name = d.data.availableTokens.WSOL.symbol
      WSOLToken.symbol = d.data.availableTokens.WSOL.symbol
      localStorage.setItem("WSOLToken", JSON.stringify(WSOLToken))

      FactoryAddress.address = d.data.adapters.uniswapV2.conf.uniswapV2FactoryAddress
      localStorage.setItem("FactoryAddress", JSON.stringify(FactoryAddress))
      AdapterAddress.address = d.data.adapters.uniswapV2.conf.exchangeAddress
      localStorage.setItem("AdapterAddress", JSON.stringify(AdapterAddress))
      VaultFactoryAddress.address = d.data.vaultFactoryAddress
      localStorage.setItem("VaultFactoryAddress", JSON.stringify(VaultFactoryAddress))
      IntegrationManagerAddress.address = d.data.integrationManagerAddress
      localStorage.setItem("IntegrationManagerAddress", JSON.stringify(IntegrationManagerAddress))

      ValueEvaluatorAddress.address = d.data.valueEvaluatorAddress
      localStorage.setItem("ValueEvaluatorAddress", JSON.stringify(ValueEvaluatorAddress))
      setShow(true)
    })


  }
  useEffect(() => {
    if (router.isReady) {
      init()
    }
  }, [router.isReady])



  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#50F6BF",
          },
          components: {
            Table: {
              borderRadius: 4,
              borderRadiusLG: 6,
              colorBgContainer: "transparent",
              fontSize: 14,
              rowHoverBg: "var(--bg-third-hover-color)",
              colorText: "var(--text-third-color)",
            },
            Button: {
              colorText: "var(--text-third-color)",
              colorBorder: "var(--border-third-color)",
              colorBgContainer: "transparent",
              textHoverBg: "#fff",
              borderRadius: ("var(--border-radius-lg)" as any),
            },

            Select: {
              colorText: "var(--text-third-color)",
              colorBorder: "var(--border-third-color)",
              colorBgContainer: "transparent",
            },
            Popover: {
              colorBgElevated: "rgba(48,48,48, 0.9)",
            },
          },
        }}
      >
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, height=device-height, user-scalable=0"
          />
          <meta
            property="og:image"
            content="https://assets.cbindex.finance/api/uploads/thumbnail/ozb1eycfl7.png"
          />
          <meta
            property="og:url"
            content="https://sim.cbindex.finance/en"
          ></meta>
          <meta name="msapplication-starturl" content="/en" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@CBIndex_Global"></meta>
          <meta
            name="twitter:description"
            content="Crypto Assets Management With On-Chain Funds."
          ></meta>
          <meta
            property="twitter:image"
            content="https://assets.cbindex.finance/api/uploads/thumbnail/ozb1eycfl7.png"
          ></meta>
          <title>
            CBIndex DApp | Crypto Assets Management With On-Chain Funds
          </title>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-J3DXF8CHRK"
          ></script>
        </Head>
        {show && <Layout>
          <Component {...pageProps} />
        </Layout>}
      </ConfigProvider>
    </>
  );
}
