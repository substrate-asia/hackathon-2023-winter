import { aaVisibility, Animated, type AnimatedProp, Animator, cx, FrameSVGOctagon, Illuminator } from '@arwes/react'
import { type CSSProperties, type ReactElement, type ReactNode } from 'react'

import * as classes from './PageContentLayout.css'

interface PageContentLayoutProps {
  className?: string
  style?: CSSProperties
  animated?: AnimatedProp
  children?: ReactNode
  frame?: boolean
}

const PageContentLayout = (props: PageContentLayoutProps): ReactElement => {
  const { className, style, animated, children, frame = true } = props

  return (
    <Animated as="main" className={cx(classes.root, className)} style={style} animated={animated}>
      {frame && (
        <Animator>
          <Animated className={classes.frame} animated={aaVisibility()}>
            <FrameSVGOctagon className="page-document__svg" rightTop={false} leftBottom={false} />
            <Illuminator color="hsl(180 50% 50% / 5%)" size={400} />
          </Animated>
        </Animator>
      )}
      <div className={classes.overflow}>
        <div className={cx(classes.container, frame ? 'mb-8' : '')}>
          <div className={frame ? classes.framedContent : classes.content}>{children}</div>
        </div>
      </div>
    </Animated>
  )
}

export type { PageContentLayoutProps }
export { PageContentLayout }
