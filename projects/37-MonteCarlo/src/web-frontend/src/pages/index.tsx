import { aa, aaVisibility, Animated, Animator, BleepsOnAnimator, Text } from '@arwes/react'
import { MediaVideoList, Packages, Svg3DAddHole, Svg3DSelectSolid } from 'iconoir-react'
import { ExternalLink } from 'lucide-react'
import { type ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

import logoImg from '@/assets/images/logo.png'
import { Button } from '@/components/common/Button'
import { PageContentLayout } from '@/components/layout/PageContentLayout'
import { DEMO_ENV, WalletChain } from '@/constants/chain.ts'
import type { BleepNames } from '@/types'

const PageIndex = (): ReactElement => {
  return (
    <>
      <Animator combine manager="sequenceReverse">
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'intro' }} continuous />

        <Animated className="pt-10" animated={aa('y', 12, 0)}>
          <Animator>
            <PageContentLayout className="w-[860px] py-8" animated={aa('y', 12, 0)}>
              <Animator>
                <Animated as="h1" className="flex-center" animated={[aaVisibility()]}>
                  <img
                    role="heading"
                    className="w-16 mt-2"
                    src={logoImg}
                    alt="Monte Carlo Project"
                    title="Monte Carlo Project"
                  />
                </Animated>
              </Animator>

              <Animator>
                <Animated as="h2" className="text-center mt-8 text-2xl" animated={[aaVisibility(), aa('scaleX', 1, 1)]}>
                  <Text>Decentralized AI App Platform</Text>
                </Animated>
                <Animated as="article" className="flex-center mt-4" animated={[aaVisibility(), aa('scaleX', 1, 1)]}>
                  <Text className="w-3/4 text-center">
                    Monte Carlo is an open AI application platform, where developers can deploy their own AI apps and
                    generate results through decentralized computing power.
                    <br />
                    Users can directly pay with cryptocurrency to use the AI apps.
                  </Text>
                </Animated>
              </Animator>

              <Animator>
                <nav className="flex-center mt-6 grid grid-cols-4">
                  <NavItem icon={<Packages />} title="Worker" to="/worker" />
                  <NavItem icon={<Svg3DAddHole />} title="App" to="/app" />
                  <NavItem icon={<Svg3DSelectSolid />} title="Task" to="/task" />
                  <NavItem icon={<MediaVideoList />} title="Gallery" to="/gallery" />
                </nav>
              </Animator>
            </PageContentLayout>
          </Animator>
        </Animated>
      </Animator>
    </>
  )
}

function NavItem({ icon, to, title }: { icon: ReactElement; to: string; title: string }) {
  return (
    <Animated className="flex-center" animated={[aaVisibility(), aa('x', -24, 0)]}>
      <NavLink to={to} target={to.startsWith('http') ? '_blank' : undefined}>
        <Button size="small" tabIndex={-1} title={`Go to ${title}`}>
          {icon}
          <span>{title}</span>
        </Button>
      </NavLink>
    </Animated>
  )
}

export default PageIndex
