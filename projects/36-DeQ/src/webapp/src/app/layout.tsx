'use client';

import '@fontsource-variable/noto-sans-sc'
import './globals.css'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useAtom } from 'jotai'

import { TrpcContextProvider } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

import { Dialog, ThemeProvider } from '../components/material-tailwind'
import SessionProvider from "@/components/SessionProvider"
import Login from "../components/Login"
import { buyAnswerIdAtom, sellAnswerIdAtom } from '@/components/atoms'
import { BuyShareDialog } from '@/components/BuyShareDialog'
import { SellShareDialog } from '@/components/SellShareDialog'

const { chains, publicClient } = configureChains([mandala], [publicProvider()])
const config = createConfig({
  // autoConnect: true,
  connectors: [
    new InjectedConnector({ chains })
  ],
  publicClient,
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [buyAnswerId, setBuyAnswerId] = useAtom(buyAnswerIdAtom)
  const [sellAnswerId, setSellAnswerId] = useAtom(sellAnswerIdAtom)
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TrpcContextProvider>
          <WagmiConfig config={config}>
            <SessionProvider>
              <ThemeProvider>
                <nav className="container flex flex-row justify-between items-center mx-auto px-8 py-4 mb-4">
                  <a href="/"><img src="/logo.png" alt="logo" className="w-20" /></a>
                  <Login />
                </nav>
                {children}
                <Dialog open={!!buyAnswerId} handler={() => setBuyAnswerId(null)}>
                  {buyAnswerId ? <BuyShareDialog id={buyAnswerId} /> : <></>}
                </Dialog>
                <Dialog open={!!sellAnswerId} handler={() => setSellAnswerId(null)}>
                  {sellAnswerId ? <SellShareDialog id={sellAnswerId} /> : <></>}
                </Dialog>
              </ThemeProvider>
            </SessionProvider>
          </WagmiConfig>
        </TrpcContextProvider>
      </body>
    </html>
  )
}
