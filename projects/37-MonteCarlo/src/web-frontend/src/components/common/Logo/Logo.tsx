import { Animated, type AnimatedProp, cx } from '@arwes/react'
import { type ReactElement } from 'react'

import logoImg from '@/assets/images/logo.png'

import * as classes from './Logo.css'

interface LogoProps {
  className?: string
  animated?: AnimatedProp
}

const Logo = (props: LogoProps): ReactElement => {
  const { className, animated } = props

  return (
    <Animated as="img" className={cx(classes.root, className)} animated={animated} src={logoImg} role="presentation" />
  )
}

export type { LogoProps }
export { Logo }
