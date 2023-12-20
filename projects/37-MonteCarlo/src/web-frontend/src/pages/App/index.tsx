import { aa, aaOpacity, aaVisibility, Animated, Animator, BleepsOnAnimator } from '@arwes/react'

import { PageContentLayout } from '@/components/layout/PageContentLayout'
import TemplateCard from '@/components/ui/TemplateCard'
import templates from '@/constants/templates.ts'
import type { BleepNames } from '@/types'

export default function () {
  return (
    <>
      <Animator>
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'intro' }} continuous />

        <PageContentLayout frame={false} className="mt-6">
          <Animator manager="stagger" combine>
            <div className="grid grid-cols-4">
              {templates.map((i, index) => (
                <Animator key={index}>
                  <div className="px-4 pb-4">
                    <TemplateCard animated={[aaOpacity(), aa('y', 8, 0, 0)]} data={i} />
                  </div>
                </Animator>
              ))}
            </div>
          </Animator>
        </PageContentLayout>
      </Animator>
    </>
  )
}
