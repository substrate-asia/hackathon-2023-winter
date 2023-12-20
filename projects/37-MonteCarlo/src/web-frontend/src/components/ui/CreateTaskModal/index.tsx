import { aa, aaVisibility, Animated, Animator, BleepsOnAnimator, useBleeps } from '@arwes/react'
import { FastArrowRight, ServerConnection, ShieldLoading } from 'iconoir-react'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterval } from 'usehooks-ts'

import { fetchJobByTrackId } from '@/apis/fetchJobByTrackId'
import { Button } from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ModalLayout from '@/components/layout/ModalLayout'
import { atomCreateTaskModal } from '@/constants'
import { CURRENCY_SYMBOL } from '@/constants/chain'
import { useAppContext } from '@/contexts/common.tsx'
import type { BleepNames } from '@/types'

interface IParams {
  data: any
  price?: number
}

export default function ({ data, price }: IParams) {
  const bleeps = useBleeps()

  const nav = useNavigate()
  const [showModal, setShowModal] = useAtom(atomCreateTaskModal)
  const [state, setState] = useState<'preview' | 'waiting' | 'loading'>('preview')
  const [trackId, setTrackId] = useState<string>()
  const {
    submitTask: { submit, isSuccess, isLoading },
    setPayload,
  } = useAppContext()

  // close on success
  useInterval(
    async () => {
      if (!trackId || !showModal) {
        return
      }
      if (trackId === 'SKIP') {
        setShowModal(false)
        setTrackId(undefined)
        nav('/task')
      } else {
        const result = await fetchJobByTrackId(trackId ?? '')
        if (result.jobs.length > 0) {
          setShowModal(false)
          setTrackId(undefined)
          nav('/task')
        }
      }
    },
    isSuccess ? 2000 : null
  )

  // update on data change
  useEffect(() => {
    setPayload(data)
  }, [data, setPayload])

  // if loading ,set status to loading
  useEffect(() => {
    if (isLoading) {
      setState('loading')
    } else {
      if (!isSuccess && state === 'loading') {
        setState('preview')
      }
    }
  }, [isLoading, state, isSuccess])

  // hide modal on close
  const onClose = useCallback(() => {
    setShowModal(false)
    bleeps.click?.play()
  }, [bleeps.click, setShowModal])

  // handle submit click
  const onClick = useCallback(async () => {
    setState('waiting')
    const id = submit()
    if (!id) {
      setState('preview')
      return
    }
    setTrackId(id)
  }, [submit])

  return (
    <Modal>
      <Animator merge>
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'open' }} continuous />
        <Animator merge unmountOnExited>
          <ModalLayout title="Create a New Task" onClose={onClose}>
            <div className="relative">
              <PreviewPanel data={data} opacity={state === 'preview' ? 1 : 0} />
              {state === 'waiting' && <WaitingPanel />}
              {state === 'loading' && <LoadingPanel />}
            </div>
            <hr className="mb-6" />

            <div className="flex flex-row items-center justify-between">
              <div className="text-secondary font-bold">
                Cost: {price} {CURRENCY_SYMBOL}
              </div>
              <Button
                className={`mr-4 ${isLoading ? 'cursor-not-allowed' : ''}`}
                frame="hexagon"
                animated={[aaVisibility(), aa('x', -12, 0)]}
                tabIndex={-1}
                onClick={onClick}
                disabled={isLoading}
              >
                <span>{isLoading ? 'Loading' : 'Submit'}</span>
              </Button>
            </div>
          </ModalLayout>
        </Animator>
      </Animator>
    </Modal>
  )
}

function PreviewPanel({ data, opacity }: { data: any; opacity: number }) {
  const { prompt, negative_prompt, seed, steps } = data

  return (
    <div style={{ opacity: opacity }}>
      <Animated className="my-4">
        <h3 className="pb-1 flex flex-row items-center text-sm">
          <FastArrowRight />
          <span>Prompt</span>
        </h3>
        <div className="block w-full">{prompt}</div>
      </Animated>
      {negative_prompt && (
        <Animated className="my-4">
          <h3 className="pb-1 flex flex-row items-center text-sm">
            <FastArrowRight />
            <span>Negative Prompt</span>
          </h3>
          <div className="block w-full">{negative_prompt}</div>
        </Animated>
      )}
      <Animated className="mb-4">
        <h3 className="pb-1 flex flex-row items-center text-sm">
          <FastArrowRight />
          <span>Parameters</span>
        </h3>
        <div className="flex flex-row items-center">
          <div className="mr-1">
            <span className="opacity-60 inline-block w-12">Seed</span>: {seed}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="mr-1">
            <span className="opacity-60 inline-block w-12">Steps</span>: {steps}
          </div>
        </div>
      </Animated>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div className="absolute left-0 top-0 w-full h-full bg flex flex-row items-center justify-center text-secondary shinning text-xl">
      <ServerConnection className="mr-2" />
      Loading on-chain status
    </div>
  )
}

function WaitingPanel() {
  return (
    <div className="absolute left-0 top-0 w-full h-full bg flex flex-row items-center justify-center text-secondary shinning text-xl">
      <ShieldLoading className="mr-2" />
      Waiting for user approval
    </div>
  )
}
