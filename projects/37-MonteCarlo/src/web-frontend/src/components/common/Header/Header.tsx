import { aa, aaVisibility, Animated, Animator, cx } from '@arwes/react'
import { MediaVideoList, Packages, SoundHigh, SoundOff, Svg3DAddHole, Svg3DSelectSolid } from 'iconoir-react'
import { useAtom } from 'jotai'
import { type ReactElement } from 'react'
import { useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Menu } from '@/components/common/Header/Menu'
import { MenuItem } from '@/components/common/Header/MenuItem'
import { atomAudio } from '@/constants'
import { useAppContext } from '@/contexts/common.tsx'
import { hiddenSMDown } from '@/styles'

import { Logo } from '../Logo'
import * as classes from './Header.css'
import { HeaderLayout, type HeaderLayoutProps } from './HeaderLayout'

interface HeaderProps extends HeaderLayoutProps {}

const leftItemAnimation = [aaVisibility(), aa('x', -4, 0, 0)]
const rightItemAnimation = [aaVisibility(), aa('x', 4, 0, 0)]

const Header = (props: HeaderProps): ReactElement => {
  const { pathname } = useLocation()
  const [audio, setAudio] = useAtom(atomAudio)
  const { walletComponent } = useAppContext()

  const isHome = pathname === '/'

  return (
    <HeaderLayout
      {...props}
      left={
        <Animator>
          <MenuNavItem icon={<Logo animated={leftItemAnimation} />} title="Monte Carlo" to="/" />
        </Animator>
      }
      center={
        !isHome && (
          <Animator combine manager="stagger" duration={{ stagger: 0.03 }}>
            <Menu>
              <MenuNavItem icon={<Packages />} title="Worker" to="/worker" />
              <MenuNavItem icon={<Svg3DAddHole />} title="App" to="/app" />
              <MenuNavItem icon={<Svg3DSelectSolid />} title="Task" to="/task" />
              <MenuNavItem icon={<MediaVideoList />} title="Gallery" to="/gallery" />
            </Menu>
          </Animator>
        )
      }
      right={
        <Animator>
          <Menu>
            <Animator>
              <MenuItem className={cx(classes.menuItem)} animated={rightItemAnimation}>
                <button
                  className={classes.button}
                  title={audio ? 'Disable audio' : 'Enable audio'}
                  onClick={() => setAudio(!audio)}
                >
                  {audio ? <SoundHigh /> : <SoundOff />}
                </button>
              </MenuItem>
            </Animator>

            <Animated>
              <MenuItem className={cx(classes.menuItem) + ' ml-2'} animated={rightItemAnimation}>
                {walletComponent}
              </MenuItem>
            </Animated>
          </Menu>
        </Animator>
      }
    />
  )
}

function MenuNavItem({ icon, to, title }: { icon: ReactElement; to: string; title: string }) {
  const { pathname } = useLocation()

  return (
    <Animator>
      <MenuItem
        className={cx(classes.menuItem)}
        active={to !== '/' && pathname.startsWith(to)}
        animated={leftItemAnimation}
      >
        <NavLink to={to}>
          {icon} <span className={hiddenSMDown}>{title}</span>
        </NavLink>
      </MenuItem>
    </Animator>
  )
}

export type { HeaderProps }
export { Header }
