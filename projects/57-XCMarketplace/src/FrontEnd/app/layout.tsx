'use client';
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
const StickyNavbar = dynamic((async() => (await import('../src/navbar/StickNavbar')).StickyNavbar )as any, { ssr: false }) as any;
// import { StickyNavbar } from '../src/navbar/StickNavbar'
import { Metadata } from 'next'
// import { WalletProvider } from '../src/wallet-extension/wallet-context'
// const WalletProvider = dynamic((async() => (await import('../src/wallet-extension/wallet-context')).WalletProvider )as any, { ssr: false }) as any;
const WalletProvider = dynamic((async() => (await import('../src/wallet_provider')).default )as any, { ssr: false }) as any;
// import WalletProvider from '@/src/wallet_provider';
const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'XCMarketplace',
//   description: 'The Crosschain Token Exchanger',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <StickyNavbar />
          {children}
        </WalletProvider> 
      </body>
    </html>
  )
}
