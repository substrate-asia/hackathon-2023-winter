import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UseInkProvider } from "useink";
import { AlephTestnet } from "useink/chains";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UseInkProvider
    config={{
      dappName: "CreateNFT",
      chains: [AlephTestnet],
    }}
  >
    <App />
  </UseInkProvider>
);
