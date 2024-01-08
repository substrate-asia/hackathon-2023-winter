import { aa, Animated, type AnimatedProp, Animator, cx, Dots, Puffs } from '@arwes/react'
import { type ReactElement } from 'react'
import { useLocation } from 'react-router'

import * as classes from './Background.css'

interface BackgroundProps {
  className?: string
  animated?: AnimatedProp
}

const Background = (props: BackgroundProps): ReactElement => {
  const { className, animated } = props

  const { pathname } = useLocation()
  const isIndex = pathname === '/'

  return (
    <Animator merge combine>
      <Animated role="presentation" className={cx(classes.root, className)} animated={animated}>
        <Animator>
          <Animated
            as="picture"
            role="presentation"
            className={classes.layer1}
            style={{
              filter: `brightness(${isIndex ? 0.4 : 0.3}) blur(${isIndex ? 0 : 10}px)`,
            }}
            animated={[aa('opacity', 0.8, 1), aa('scale', 1.05, 1)]}
          ></Animated>
        </Animator>

        <Animator duration={{ enter: 2 }} unmountOnDisabled>
          <Dots className={classes.layer2} color="hsla(180, 29%, 72%, 0.15)" size={2} distance={40} originInverted />
        </Animator>

        <Animator duration={{ enter: 2, interval: 4 }} unmountOnDisabled>
          <Puffs className={classes.layer3} color="hsla(180, 29%, 72%, 0.25)" quantity={20} />
        </Animator>
      </Animated>
    </Animator>
  )
}

export type { BackgroundProps }
export { Background }
