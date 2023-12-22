//@ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import "ui/style.css";
import { UseInkProvider } from "useink";
import { RococoContractsTestnet, ShibuyaTestnet } from "useink/chains";
import { NotificationsProvider } from "useink/notifications";
import metadata from "../assets/erc721.json";
//@ts-ignore
import App from "./App.jsx";
import "./Global.css";
//@ts-ignore
import { Providers } from "./redux/provider.jsx";

//@ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UseInkProvider
      config={{
        dappName: metadata.contract.name,
        chains: [ShibuyaTestnet],
        caller: {
          //
          default: "5EyR7vEk7DtvEWeefGcXXMV6hKwB8Ex5uvjHufm466mbjJkR",
        },
      }}
    >
      <NotificationsProvider>
        <Providers>
          <App />
        </Providers>
      </NotificationsProvider>
    </UseInkProvider>
  </React.StrictMode>
);
