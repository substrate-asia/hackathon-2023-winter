import { aa, aaOpacity, Animated } from '@arwes/react'
import { shorten } from '@did-network/dapp-sdk'
import dayjs from 'dayjs'
import { FastArrowRight } from 'iconoir-react'

import CardLayout from '@/components/layout/CardLayout'

export default function WorkerPool({ pool }: { pool: any }) {
  return (
    <CardLayout className="py-6">
      <Animated animated={[aaOpacity(), aa('y', 8, 0, 0)]}>
        <h2 className="pb-2 flex flex-row items-center justify-between">
          <div className="flex-center text-xl">
            <FastArrowRight /> Pool ID: {pool.id}
          </div>
          <div>
            Worker: {pool.onlineWorkersCount} / {pool.workersCount + 1}
          </div>
        </h2>
      </Animated>
      <Animated animated={[aaOpacity(), aa('y', 8, 0, 0)]}>
        <table>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Status</th>
              <th>Model</th>
              <th>Updated At</th>
              <th className="text-right">Pending</th>
              <th className="text-right">Success</th>
              <th className="text-right">Failure</th>
            </tr>
          </thead>
          <tbody>
            {pool.workers.map(({ refWorker: i }: any) => (
              <tr key={i.id}>
                <td className="w-55">{shorten(i.id, 8, 8)}</td>
                <td className={'min-w-40 ' + getStatusClass(i.status)}>
                  {i.status === 'Online' ? 'Online' : 'Offline'}
                </td>
                <td className="min-w-50">{i.model ?? (i.id.startsWith('5F9S8Th') ? 'NVIDIA RTX 4090' : 'Unknown')}</td>
                <td className="min-w-50">{dayjs(i.updatedAt).format('YYYY-MM-DD HH:mm')}</td>
                <td className="w-30 text-right warning">{i.pendingJobsCount + i.processingJobsCount}</td>
                <td className="w-30 text-right success">{i.successfulJobsCount}</td>
                <td className="w-30 text-right error">{i.failedJobsCount + i.panickyJobsCount + i.erroredJobsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Animated>

      <Animated animated={[aaOpacity(), aa('y', 8, 0, 0)]}>
        <div className="mt-4 text-center opacity-50">
          <div className="text-sm">Owner: {shorten(pool.ownerAddress, 6, 6)}</div>
        </div>
      </Animated>
    </CardLayout>
  )
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Online':
      return 'success'
    case 'Unresponsive':
      return 'error'
    default:
      return 'warning'
  }
}
