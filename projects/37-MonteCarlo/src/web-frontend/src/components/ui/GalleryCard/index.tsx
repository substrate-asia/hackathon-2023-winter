import { Animated, type AnimatedProp, cx, FrameSVGOctagon } from '@arwes/react'

import * as classes from './index.css'

interface CardProps {
  className?: string
  animated?: AnimatedProp
  src: string
}

export default function (props: CardProps) {
  const { className, animated, src } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <Animated as="article" className={cx(classes.root, className)} animated={animated}>
      {loaded && <FrameSVGOctagon squareSize={16} leftBottom={false} rightTop={false} />}
      <div className={classes.container}>
        <div className={classes.asset}>
          <img
            className="w-full object-cover object-center max-h-[75vh]"
            src={src}
            alt=""
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </Animated>
  )
}
