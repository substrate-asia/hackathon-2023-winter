import { aaVisibility, Animated, type AnimatedProp, Animator, cx, FrameSVGOctagon, Illuminator } from '@arwes/react'
import { type CSSProperties, type ReactNode } from 'react'

import * as classes from './index.css'

interface IProps {
  className?: string
  style?: CSSProperties
  animated?: AnimatedProp
  children?: ReactNode
}

export default function (props: IProps) {
  const { className, style, animated, children } = props

  return (
    <Animated className={cx(classes.root, className)} style={style} animated={animated}>
      <Animator>
        <Animated className={classes.frame} animated={aaVisibility()}>
          <FrameSVGOctagon className="page-document__svg" />
        </Animated>
      </Animator>
      <div className={classes.content}>{children}</div>
    </Animated>
  )
}
