import { aa, aaVisibility, Animated, Animator, AnimatorGeneralProvider, BleepsOnAnimator, Text } from '@arwes/react'
import { useQuery } from '@did-network/dapp-sdk'
import { AddSquare, FastArrowRight, Gamepad, MinusSquare, Svg3DSelectSolid } from 'iconoir-react'
import { useAtom } from 'jotai'
import { useNavigate, useParams } from 'react-router-dom'

import { useFetchJob } from '@/apis'
import { BleepClick } from '@/components/common/BleepClick'
import { Button } from '@/components/common/Button'
import CardLayout from '@/components/layout/CardLayout'
import CreateTaskModal from '@/components/ui/CreateTaskModal'
import Card from '@/components/ui/PolyCard'
import { atomCreateTaskModal } from '@/constants'
import { CURRENCY_SYMBOL } from '@/constants/chain'
import templates from '@/constants/templates.ts'
import { useAppContext } from '@/contexts/common.tsx'
import type { BleepNames } from '@/types'

export default function () {
  const { id } = useParams<{ id: string }>()
  const taskId = useQuery('task')
  const jobData = useFetchJob(taskId)
  const nav = useNavigate()
  const { walletAddress } = useAppContext()

  const data = templates.find((i) => i.sd_model_name === id)
  const keys = [
    ['Model Name', 'sd_model_name'],
    ['Sampler Name', 'sampler_name'],
    ['Width', 'width'],
    ['Height', 'height'],
    ['CFG Scale', 'cfg_scale'],
  ]

  const { workers_count = 0, name, cover: defaultCover, price } = data ?? {}

  const [prompt, setPrompt] = useState('')
  const [cover, setCover] = useState(defaultCover)
  const [steps, setSteps] = useState(20)
  const [seed, setSeed] = useState(randomSeed())
  const [showModal, setShowModal] = useAtom(atomCreateTaskModal)
  const [negativePrompt, setNegativePrompt] = useState('')

  const buttonText = useMemo(() => {
    if (workers_count === 0) {
      return 'No Worker Available'
    }
    if (!walletAddress) {
      return 'No Wallet'
    }
    return 'Create'
  }, [walletAddress, workers_count])

  const onClick = useCallback(() => {
    setShowModal(true)
  }, [setShowModal])

  const payload = useMemo(() => {
    const payload = JSON.parse(JSON.stringify(data))
    payload.seed = seed
    payload.steps = steps
    payload.prompt = prompt
    payload.negative_prompt = negativePrompt
    return payload
  }, [data, negativePrompt, prompt, seed, steps])

  useEffect(() => {
    if (!jobData) {
      return
    }
    const job = JSON.parse(jobData.input).data
    const output = JSON.parse(jobData.output)
    setCover(output.data.imageUrl)
    setSteps(job.steps)
    setPrompt(job.prompt)
    setNegativePrompt(job.negative_prompt)
  }, [jobData])

  if (!data) {
    return null
  }

  const disabled = workers_count === 0 || prompt.length < 1 || !walletAddress

  return (
    <>
      <Animator combine manager="sequence">
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'assemble' }} />
        <Animator manager="sequence" combine>
          <div style={{ width: '1200px' }} className="pt-6">
            <div className="flex flex-row">
              <div className="w-1/3 pr-10">
                <Animator>
                  <Card src={cover} title={name} animated={aa('y', 12, 0)}>
                    <div className="flex flex-row items-center justify-between">
                      <p className={workers_count > 0 ? 'success' : ''}>Worker: {workers_count}</p>
                      <p>
                        Price: {price} {CURRENCY_SYMBOL}
                      </p>
                    </div>
                    <hr />
                    <div>
                      {keys.map((i) => (
                        <div key={i[0]} className="flex flex-row justify-between">
                          <span className="opacity-60 w-30">{i[0]}:</span>
                          <span>{(data as any)[i[1]]}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Animator>
              </div>
              <div className="flex-1">
                <Animator>
                  <CardLayout className="py-6" animated={aa('y', 12, 0)}>
                    <Text as="h1" className="text-xl">
                      Create Task from Template
                    </Text>
                    <Animator>
                      <Animated as="hr" className="mt-2 mb-4" animated={aa('scaleX', 0, 1)} />
                    </Animator>
                    <Animated className="mb-4">
                      <h3 className="pb-1 flex flex-row items-center text-sm">
                        <FastArrowRight />
                        <span>Prompt</span>
                      </h3>
                      <textarea
                        className="block w-full"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </Animated>
                    <Animated className="mb-4">
                      <h3 className="pb-1 flex flex-row items-center text-sm">
                        <FastArrowRight />
                        <span>Negative Prompt</span>
                      </h3>
                      <textarea
                        className="block w-full"
                        rows={3}
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                      />
                    </Animated>

                    <Animated className="mb-4 select-none">
                      <h3 className="pb-1 flex flex-row items-center text-sm">
                        <FastArrowRight />
                        <span>Parameters</span>
                      </h3>
                      <div className="flex flex-row items-center">
                        <div className="mr-1">
                          <span className="opacity-60 inline-block w-12">Seed</span>: {seed}
                        </div>

                        <BleepClick>
                          <Gamepad
                            className="p-0.5 cursor-pointer text-secondary"
                            onClick={() => {
                              setSeed(randomSeed())
                            }}
                          />
                        </BleepClick>
                      </div>
                      <div className="flex flex-row items-center">
                        <div className="mr-1">
                          <span className="opacity-60 inline-block w-12">Steps</span>: {steps}
                        </div>
                        <BleepClick>
                          <AddSquare
                            className="p-0.5 cursor-pointer text-secondary"
                            onClick={() => {
                              setSteps(steps + 1)
                            }}
                          />
                        </BleepClick>
                        <BleepClick>
                          <MinusSquare
                            className="p-0.5 cursor-pointer text-secondary"
                            onClick={() => {
                              setSteps(steps - 1)
                            }}
                          />
                        </BleepClick>
                      </div>
                    </Animated>

                    <hr className="mt-4 mb-6" />

                    <div className="flex flex-row items-center justify-between">
                      <div className="text-secondary font-bold">
                        Cost: {price} {CURRENCY_SYMBOL}
                      </div>
                      <Button
                        className={`mr-4 ${disabled ? 'cursor-not-allowed' : ''}`}
                        frame="hexagon"
                        animated={[aaVisibility(), aa('x', -12, 0)]}
                        tabIndex={-1}
                        onClick={onClick}
                        disabled={disabled}
                      >
                        <Svg3DSelectSolid className="text-sm" />
                        <span>{buttonText}</span>
                      </Button>
                    </div>
                  </CardLayout>
                </Animator>
              </div>
            </div>
          </div>
        </Animator>
      </Animator>

      <AnimatorGeneralProvider
        duration={{
          enter: 0.1,
          exit: 0.1,
          stagger: 0.05,
        }}
        disabled={false}
        dismissed={false}
      >
        <Animator root active={showModal}>
          <CreateTaskModal data={payload} price={price} />
        </Animator>
      </AnimatorGeneralProvider>
    </>
  )
}

function randomSeed() {
  return Math.floor(Math.random() * 10000000) + 1
}
