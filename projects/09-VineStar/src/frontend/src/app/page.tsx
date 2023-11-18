'use client'
import Image from 'next/image'

import React from 'react'
import { Stack } from '@visx/shape'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { transpose } from '@visx/vendor/d3-array'
import { animated, useSpring } from '@react-spring/web'

import useForceUpdate from './useForceUpdate'
import generateData from './generateData'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// constants
const NUM_LAYERS = 20
const SAMPLES_PER_LAYER = 200
const BUMPS_PER_LAYER = 10
// utils
const range = (n: number) => Array.from(new Array(n), (_, i) => i)

const keys = range(NUM_LAYERS)

// scales
const xScale = scaleLinear<number>({
  domain: [0, SAMPLES_PER_LAYER - 1]
})
const yScale = scaleLinear<number>({
  domain: [-30, 50]
})
const colorScale = scaleOrdinal<number, string>({
  domain: keys,
  range: [
    '#E0187F',
    '#E018D4',
    '#A41BB1',
    '#821C63',
    '#D82358',
    '#C3037F',
    '#E0187F'
  ]
})

// accessors
type Datum = number[]
const getY0 = (d: Datum) => yScale(d[0]) ?? 0
const getY1 = (d: Datum) => yScale(d[1]) ?? 0

export type StreamGraphProps = {
  width: number
  height: number
  animate?: boolean
}

function Streamgraph ({ width, height, animate = true }: StreamGraphProps) {
  const forceUpdate = useForceUpdate()
  const handlePress = () => forceUpdate()

  if (width < 10) return null

  xScale.range([0, width])
  yScale.range([height, 0])

  // generate layers in render to update on touch
  const layers = transpose<number>(
    keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER))
  )

  return (
    <svg width={width} height={height}>
      <PatternCircles
        id='mustard'
        height={40}
        width={40}
        radius={5}
        fill='#036ecf'
        complement
      />
      <PatternWaves
        id='cherry'
        height={12}
        width={12}
        fill='#E5E5EA'
        stroke='#232493'
        strokeWidth={1}
      />
      <PatternCircles
        id='navy'
        height={60}
        width={60}
        radius={10}
        fill='white'
        complement
      />
      <PatternCircles
        complement
        id='circles'
        height={60}
        width={60}
        radius={10}
        fill='transparent'
      />

      <g onClick={handlePress} onTouchStart={handlePress}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'transparent'}
          rx={14}
        />
        <Stack<number[], number>
          data={layers}
          keys={keys}
          offset='wiggle'
          color={colorScale}
          x={(_, i) => xScale(i) ?? 0}
          y0={getY0}
          y1={getY1}
        >
          {({ stacks, path }) =>
            stacks.map(stack => {
              // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
              const pathString = path(stack) || ''
              const tweened = animate
                ? useSpring({ pathString })
                : { pathString }
              const color = colorScale(stack.key)
              return (
                <g key={`series-${stack.key}`}>
                  <animated.path d={tweened.pathString} fill={color} />
                </g>
              )
            })
          }
        </Stack>
      </g>
    </svg>
  )
}

const Section = ({ children, id, className }: any) => {
  return (
    <motion.section className={`${className} min-h-screen section`} id={id}>
      {children}
    </motion.section>
  )
}

export default function Home () {
  const router = useRouter()

  return (
    <main>
      <Section className='bg-[#FFF0DB] min-h-screen relative ' id='main'>
        <Streamgraph width={window.innerWidth} height={window.innerHeight} />
        <h1
          onClick={() => router.push('#about')}
          className='absolute cursor-pointer text-white font-bold text-6xl z-50 title'
        >
          VineStar
        </h1>
      </Section>
      <Section className='bg-indigo-950' id='about'></Section>
    </main>
  )
}
