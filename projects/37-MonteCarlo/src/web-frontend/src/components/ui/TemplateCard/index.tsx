import { Animated, type AnimatedProp, cx, FrameSVGOctagon } from '@arwes/react'
import { NavLink } from 'react-router-dom'

import { CURRENCY_SYMBOL } from '@/constants/chain'

import * as classes from './index.css'

interface MetaTaskCardProps {
  className?: string
  animated?: AnimatedProp
  data: any
}

export default function ({ className, animated, data }: MetaTaskCardProps) {
  const { workers_count = 0, name, cover, sd_model_name, price = '-' } = data

  return (
    <NavLink to={`/app/${sd_model_name}`}>
      <Animated as="article" className={cx(classes.root, className)} animated={animated}>
        <FrameSVGOctagon squareSize={16} leftBottom={false} rightTop={false} />
        <div className={classes.container}>
          <div className={classes.asset}>
            <img className={classes.image} src={cover} alt="" />
          </div>
          <div className={classes.content}>
            <h1 className={classes.title}>{name}</h1>
            <div className={classes.children}>
              <div className="flex flex-row items-center justify-between">
                <p className={workers_count > 0 ? 'success' : ''}>Worker: {workers_count}</p>
                <p>
                  Price: {price} {CURRENCY_SYMBOL}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Animated>
    </NavLink>
  )
}
