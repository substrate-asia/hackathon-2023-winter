import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { PolkadotProvider } from '@/contexts/dot/PolkadotProvider.tsx'
import { DotContext } from '@/contexts/dotContext.tsx'

import '@/assets/styles/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

console.table(import.meta.env)

const root = createRoot(document.getElementById('root')!)
root.render(
  <PolkadotProvider>
    <DotContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DotContext>
  </PolkadotProvider>
)
