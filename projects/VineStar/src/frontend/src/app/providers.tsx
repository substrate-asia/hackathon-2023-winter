'use client'
import { ReactNode } from 'react'
import { UseInkProvider } from 'useink'
import { RococoContractsTestnet, ShibuyaTestnet } from 'useink/chains'

function Providers ({ children }: { children: ReactNode }) {
  return (
    <UseInkProvider
      config={{
        dappName: 'Flipper',
        chains: [RococoContractsTestnet, ShibuyaTestnet]
      }}
    >
      {children}
    </UseInkProvider>
  )
}

export { Providers }
