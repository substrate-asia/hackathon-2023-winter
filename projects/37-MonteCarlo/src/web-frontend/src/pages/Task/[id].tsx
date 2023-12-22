import { aa, Animated, Animator, BleepsOnAnimator, Text } from '@arwes/react'
import { FastArrowRight, Svg3DAddHole, Svg3DSelectSolid } from 'iconoir-react'
import { NavLink, useParams } from 'react-router-dom'

import { useFetchJob } from '@/apis'
import { PageContentLayout } from '@/components/layout/PageContentLayout'
import Card from '@/components/ui/PolyCard'
import { CURRENCY_SYMBOL } from '@/constants/chain'
import templates from '@/constants/templates.ts'
import type { BleepNames } from '@/types'
import { getTaskStatusClass } from '@/utils'

export default function () {
  const { id } = useParams<{ id: string }>()
  const data = useFetchJob(id)
  const keys = [
    ['Model Name', 'sd_model_name'],
    ['Sampler Name', 'sampler_name'],
    ['Width', 'width'],
    ['Height', 'height'],
    ['CFG Scale', 'cfg_scale'],
  ]
  const status = useMemo(() => {
    if (data?.status === 'Processed') {
      return data.result
    }
    return data?.status ?? 'Unknown'
  }, [data])

  if (!data) {
    return (
      <div className="w-full h-30 flex-center">
        <Svg3DSelectSolid className="loading" />
      </div>
    )
  }

  const input = JSON.parse(data.input).data
  const output = JSON.parse(data.output)
  const template = templates.find((i) => i.sd_model_name === input.sd_model_name)

  console.log(input)
  console.log(output)

  if (!template) {
    return null
  }

  const { prompt, negative_prompt } = input

  return (
    <Animator combine manager="sequence">
      <BleepsOnAnimator<BleepNames> transitions={{ entering: 'assemble' }} />
      <PageContentLayout frame={false} className="pt-6">
        <div className="flex flex-row pb-6">
          <div className="w-1/3 pr-10">
            <Animator>
              <Card src={output?.data.imageUrl} title={template.name}>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    Status: <span className={getTaskStatusClass(status)}>{status}</span>
                  </div>
                  <div>
                    Cost: {template.price} {CURRENCY_SYMBOL}
                  </div>
                </div>
                <hr />
                <div>
                  {keys.map((i) => (
                    <div key={i[0]} className="flex flex-row justify-between">
                      <span className="opacity-60 w-30">{i[0]}:</span>
                      <span>{(input as any)[i[1]]}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Animator>
          </div>
          <div className="flex-1">
            <Animator>
              <PageContentLayout className="py-6">
                <Animated className="flex flex-row items-center justify-between">
                  <Text as="h1" className="flex flex-row items-center text-lg">
                    Task {id}
                  </Text>

                  <NavLink to={`/app/${template.sd_model_name}?task=${data.id}`} className="text-secondary flex-center">
                    <Svg3DAddHole className="mr-1" />
                    Fork
                  </NavLink>
                </Animated>
                <Animated as="hr" className="mt-2 mb-3" animated={aa('scaleX', 0, 1)} />
                <Animated className="my-4">
                  <h3 className="pb-1 flex flex-row items-center text-sm">
                    <FastArrowRight />
                    <span>Prompt</span>
                  </h3>
                  <Animated as="blockquote">
                    <div className="block w-full">{prompt}</div>
                  </Animated>
                </Animated>
                {negative_prompt && (
                  <Animated className="my-4">
                    <h3 className="pb-1 flex flex-row items-center text-sm">
                      <FastArrowRight />
                      <span>Negative Prompt</span>
                    </h3>
                    <Animated as="blockquote">
                      <div className="block w-full">{negative_prompt}</div>
                    </Animated>
                  </Animated>
                )}
                <Animated className="mb-4">
                  <h3 className="pb-1 flex flex-row items-center text-sm">
                    <FastArrowRight />
                    <span>Parameters</span>
                  </h3>
                  <div className="flex flex-row items-center">
                    <div className="mr-1">
                      <span className="opacity-60 inline-block w-12">Seed</span>: {input.seed}
                    </div>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="mr-1">
                      <span className="opacity-60 inline-block w-12">Steps</span>: {input.steps}
                    </div>
                  </div>
                </Animated>
              </PageContentLayout>
            </Animator>
          </div>
        </div>
      </PageContentLayout>
    </Animator>
  )
}
