import { aa, aaOpacity, Animated, Animator, BleepsOnAnimator } from '@arwes/react'
import { shorten } from '@did-network/dapp-sdk'
import dayjs from 'dayjs'
import { Svg3DSelectSolid } from 'iconoir-react'
import { CheckSquare, Square } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useFetchJobs } from '@/apis'
import { PageContentLayout } from '@/components/layout/PageContentLayout'
import { useAppContext } from '@/contexts/common.tsx'
import type { BleepNames } from '@/types'
import { getTaskStatusClass } from '@/utils'

export default function () {
  const { walletAddress, substrateAddress } = useAppContext()
  const [checked, setChecked] = useState(false)
  const { data } = useFetchJobs(checked ? substrateAddress : undefined)

  return (
    <>
      <Animator combine manager="sequenceReverse">
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'intro' }} continuous />
        {walletAddress && (
          <div className="mt-6 w-[1200px] flex flex-row justify-end">
            <div
              className="cursor-pointer flex flex-row items-center text-secondary"
              onClick={() => setChecked(!checked)}
            >
              <span>{checked ? <CheckSquare size={18} /> : <Square size={18} />}</span>
              <span className="ml-2">My Creations Only</span>
            </div>
          </div>
        )}
        <PageContentLayout className="mt-2 flex-col-center">
          {!data ? (
            <div className="w-full h-30 flex-center">
              <Svg3DSelectSolid className="loading" />
            </div>
          ) : (
            <Animator manager="stagger" combine>
              <div className="py-6">
                {data.jobs.map((i: any) => (
                  <Animator key={i.id}>
                    <Animated animated={[aaOpacity(), aa('x', 8, 0, 0)]}>
                      <TaskRow data={i} />
                    </Animated>
                  </Animator>
                ))}
              </div>
            </Animator>
          )}
        </PageContentLayout>
      </Animator>
    </>
  )
}

function TaskRow({ data }: { data: any }) {
  const nav = useNavigate()
  const input = JSON.parse(data.input)
  const output = JSON.parse(data.output)
  const status = useMemo(() => {
    if (data.status === 'Processed') {
      return data.result
    }
    return data.status
  }, [data])

  return (
    <NavLink
      to={`/task/${data.id}`}
      className="block pl-4 py-2 last:border-none border-b border-[hsla(180,81%,50%,0.08)] hover:bg-[hsla(180,88%,16.98%,0.3)]"
    >
      <div className="py-4 pr-12 flex-center h-20">
        <img
          className="h-19 w-19 object-cover mr-6"
          src={`${output?.data.imageUrl}`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = '/image-break.png'
          }}
          alt=""
        />
        <div className="flex-1">
          <h3 className="text-xl">{data.id}</h3>
          <div>{shorten(data.uniqueTrackId, 6, 6)}</div>
        </div>
        <div className="w-60">
          <div className="opacity-50 text-sm">Owner</div>
          <div>{shorten(data.beneficiaryAddress, 6, 6)}</div>
        </div>
        <div className="w-60">
          <div className="opacity-50 text-sm">Worker</div>
          <div>{shorten(data.assigneeAddress, 6, 6)}</div>
        </div>
        <div className="w-60">
          <div className="opacity-50 text-sm">Start At</div>
          <div>{dayjs(data.createdAt).format('YYYY/MM/DD HH:mm')}</div>
        </div>
        <div className="w-10">
          <div className="opacity-50 text-sm">Status</div>
          <div className={getTaskStatusClass(status)}>{status}</div>
        </div>
      </div>
    </NavLink>
  )
}
