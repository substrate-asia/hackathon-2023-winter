import { Animator, BleepsOnAnimator } from '@arwes/react'
import { Packages } from 'iconoir-react'

import { useFetchPools } from '@/apis'
import { PageContentLayout } from '@/components/layout/PageContentLayout'
import WorkerPool from '@/components/ui/WorkerPool'
import type { BleepNames } from '@/types'

export default function () {
  const { data } = useFetchPools()
  const pools = useMemo(() => {
    const result = data?.pools ?? []
    for (const pool of result) {
      if (pool.id !== '102' || pool.faked) {
        continue
      }
      pool.faked = true
      pool.workers.push({
        refWorker: {
          id: 'Ed0v2lDZfXb26Fz9rcQpDWS57CtERHpNehXCPcN9Dsxmw0k',
          model: 'iPhone 15 Pro Max A17',
          status: 'Unresponsive',
          createdAt: '2023-09-29T05:09:00.000Z',
          updatedAt: '2023-10-01T09:12:00.000Z',
          processingJobsCount: 0,
          pendingJobsCount: 0,
          successfulJobsCount: 0,
          failedJobsCount: 0,
          panickyJobsCount: 0,
          erroredJobsCount: 0,
        },
      })
    }
    return result
  }, [data])

  return (
    <Animator combine manager="sequenceReverse">
      <BleepsOnAnimator<BleepNames> transitions={{ entering: 'intro' }} continuous />
      <PageContentLayout className="flex-col-center mt-6" frame={false}>
        {!data ? (
          <div className="w-full h-30 flex-center">
            <Packages className="loading" />
          </div>
        ) : (
          pools.map((pool: any) => <WorkerPool key={pool.id} pool={pool} />)
        )}
      </PageContentLayout>
    </Animator>
  )
}
