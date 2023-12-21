import { aaVisibility, Animated, type AnimatedProp, cx, FrameSVGOctagon, Text } from '@arwes/react'
import { type ReactNode } from 'react'

import * as classes from './index.css'

interface CardProps {
  className?: string
  animated?: AnimatedProp
  src?: string
  title: ReactNode
  children: ReactNode
}

export default function Card(props: CardProps) {
  const { className, animated, src = '/image-break.png', title, children } = props

  return (
    <Animated as="article" className={cx(classes.root, className)} animated={animated}>
      <FrameSVGOctagon squareSize={16} leftBottom={false} leftTop={false} rightTop={false} />
      <div className={classes.container}>
        <div className={classes.asset}>
          <img className="w-full object-cover object-center max-h-[75vh]" src={src} alt="" />
        </div>

        <div className={classes.content}>
          <Animated>
            <Text className={classes.title} as="h1">
              {title}
            </Text>
          </Animated>
          <Animated>
            <Animated animated={aaVisibility()}>
              <div className={classes.children}>{children}</div>
            </Animated>
          </Animated>
        </div>
      </div>
    </Animated>
  )
}
