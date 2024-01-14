import { BrowserRouter, Routes, Route  } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import CreateFund from "./pages/CreateFund"
import FundsList from "./pages/Fundslist"
import React, { useState } from "react"
import { connectMetamask } from "./utils/connectMetamask"
import ManagerArea from "./pages/Manager"
import FundInvestor from "./pages/FundInvestor"
import FundManager from "./pages/FundManager"
import SuccessPage from "./pages/Success"
import { ChainContext } from "./contexts/ChainContext"

export default function App() {

  const [chain, setChain] = useState<number>(253253);

  //handle Metamask wallet connection
  const [isMetamaskInstalled, setIsMetamaskInstalled] = React.useState<boolean>(false);
  const [account, setAccount] = React.useState<string | null>(null);
  const [provider, setProvider] = React.useState<any>(null);
  const [signer, setSigner] = React.useState<any>(null);

  React.useEffect(() => {
    if ((window as any).ethereum) {
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
      setAccount((window as any).ethereum.selectedAddress);
    }
  }, []);

  async function connectWallet(): Promise<void> {
    const connection = await connectMetamask();
    setAccount(connection?.address);
    setProvider(connection?.web3Provider);
    setSigner(connection?.web3Signer);
  }

  return (
    <ChainContext.Provider value={{chain, setChain}}>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout
              isMetamaskInstalled={isMetamaskInstalled}
              connectWallet={connectWallet}
              account={account}
              signer={signer}
            />
          }>
            <Route path="/" element={<Home />} />
            <Route path="/funds-list" element={
              <FundsList
                signer={signer}
              />} />
            <Route path="/funds-list/:id" element={
              <FundInvestor
                account={account}
                provider={provider}
                signer={signer}
              />}
            />
            <Route path="/create-fund" element={
              <CreateFund
                account={account}
                signer={signer} 
              />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/manager" element={
              <ManagerArea 
                account={account}
                provider={provider}
                signer={signer}
              />} />
            <Route path="/manager/:id" element={
              <FundManager
                account={account}
                provider={provider}
                signer={signer}
              />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </ChainContext.Provider>
  )
}
