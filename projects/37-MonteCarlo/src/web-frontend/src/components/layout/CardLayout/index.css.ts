import { createFrameOctagonClip } from '@arwes/react'
import { globalStyle, style } from '@vanilla-extract/css'

export const root = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  minHeight: 0,
})

export const frame = style({
  zIndex: 1,
  position: 'absolute',
  left: '50%',
  top: '0',
  bottom: '2rem',
  display: 'none',
  width: '100%',
  maxWidth: 1200,
  transform: 'translate(-50%, 0)',
  clipPath: createFrameOctagonClip({
    squareSize: '1rem',
  }),

  '@media': {
    '(min-width: 1200px)': {
      display: 'block',
    },
  },
})

globalStyle(`${frame} path`, {
  transitionProperty: 'color',
  transitionDuration: '200ms',
  transitionTimingFunction: 'ease-out',
})

globalStyle(`${frame} [data-name=bg]`, {
  color: 'hsla(180, 100%, 10%, 0.1)',
})

globalStyle(`${frame} [data-name=line]`, {
  color: 'hsla(180, 100%, 10%, 0.5)',
})

export const content = style({
  zIndex: 2,
  padding: '0 3rem 1.5rem',
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  maxWidth: 1200,
})
