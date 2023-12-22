import { Animator, BleepsProvider, type BleepsProviderSettings } from '@arwes/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { Header } from '@/components/common/Header'
import { MainLayout } from '@/components/layout/MainLayout'
import { atomAudio } from '@/constants'
import routes from '~react-pages'

import '@/styles/global.css'

const bleepsSettings: BleepsProviderSettings = {
  master: {
    volume: 0.9,
  },
  bleeps: {
    intro: {
      sources: [{ src: 'https://arwes.dev/assets/sounds/intro.mp3', type: 'audio/mpeg' }],
    },
    click: {
      sources: [{ src: 'https://arwes.dev/assets/sounds/click.mp3', type: 'audio/mpeg' }],
    },
    assemble: {
      sources: [{ src: 'https://arwes.dev/assets/sounds/assemble.mp3', type: 'audio/mpeg' }],
    },
  },
}

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

const App = () => {
  const audio = useAtomValue(atomAudio)
  const [active] = useState(true)

  return (
    <Animator combine manager="stagger" active={active}>
      <BleepsProvider {...bleepsSettings} common={{ disabled: !audio }}>
        <Animator combine manager="stagger">
          <MainLayout>
            <Header className="z-99" />
            {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
          </MainLayout>
          <div id="app-modal-container" />
        </Animator>
      </BleepsProvider>
    </Animator>
  )
}

export default App
