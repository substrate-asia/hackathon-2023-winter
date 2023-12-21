import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Sudoku from "./App";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { moonbaseAlpha } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const root = ReactDOM.createRoot(document.getElementById("root"));

const { chains, provider, webSocketProvider } = configureChains(
  [moonbaseAlpha],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <Sudoku />
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
