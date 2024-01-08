import { useBleeps } from '@arwes/react'
import { FC, ReactNode } from 'react'

import type { BleepNames } from '@/types'

export const BleepClick: FC<{
  children: ReactNode
}> = (props) => {
  const bleeps = useBleeps<BleepNames>()

  return (
    <div
      className="flex-col-center"
      onClick={() => {
        bleeps.click?.play()
      }}
    >
      {props.children}
    </div>
  )
}
