import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

import dynamic from "next/dynamic";
import { moonbase } from "@/chain";

const Connect = dynamic(() => import("@/components/generals/Connect"), {
  ssr: false,
});

const { chains, publicClient } = configureChains(
  [moonbase],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Connect />
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
