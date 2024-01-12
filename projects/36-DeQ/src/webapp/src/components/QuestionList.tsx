'use client';

import Link from 'next/link'
import { useMemo } from 'react'
import {
  Spinner,
  Card,
  CardBody,
  Typography,
  Avatar,
  ButtonGroup,
  Button,
} from '@material-tailwind/react'
import { useSetAtom } from 'jotai'
import { formatEther, formatUnits } from 'viem'

import { trpcQuery } from '@/server/trpcProvider'
import { MarkdownView } from '@/components/MarkdownView'
import { formatRelativeTime, daysToNow } from '@/utils/datetime'
import { formatNumber } from '@/utils/number'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'

function estimateAprRewards(value: bigint, createdAt: Date) {
  const days = daysToNow(createdAt)
  if (days > 0) {
    return BigInt((days * (0.1605 / 365) * Number(value)).toFixed())
  }
  return BigInt(0)
}

function RewardsSuffix({ value, createdAt }: { value: bigint, createdAt: Date }) {
  const rewards = useMemo(() => formatEther(estimateAprRewards(value, createdAt)), [value, createdAt])
  if (Number(rewards) < 0.0001) {
    return null
  }
  const [left, right] = rewards.split('.')
  return (
    <span className="text-sm text-gray-500 pr-[1px]">
      <span>+</span>
      <span>{left}</span>
      <span>.{right.substring(0, 4)}</span>
      <span className="text-xs ml-0.5">DOT</span>
    </span>
  )
}

export function QuestionList({ type }: { type: 'hot' | 'unanswer' }) {
  const { data, isLoading } = trpcQuery.questions.lastest.useQuery({ type })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <div className="flex flex-col align-center gap-8">
      {data && data.items.map(question => question.answers.length > 0 ? (
        <Card key={question.id} className="w-full rounded-3xl px-6 py-6" shadow={false}>
          <div className="flex flex-col gap-2.5 px-12 py-4 rounded-3xl bg-gray-900 text-gray-50">
            <Link href={`/questions/view/${question.id}`}>
              <Typography variant="h5" className="hover:underline">
                {question.title}
              </Typography>
            </Link>
            <Link href={`/u/${question.user.handle}`} className="flex flex-row items-center gap-1.5">
              <Avatar
                src={question.user.avatar}
                alt="avatar"
                className="border border-gray-400 p-0.5"
                size="xs"
              />
              <Typography className="hover:underline text-sm">
                @{question.user.name}
              </Typography>
            </Link>
          </div>
          <CardBody className="flex flex-col">
            {question.answers.map((answer) => (
              <div key={answer.id} className="flex flex-row gap-4 items-start">
                <Link href={`/u/${answer.user.handle}`} className="w-24 flex-shrink-0 flex flex-col items-center justify-center gap-1.5">
                  <Avatar variant="circular" alt={answer.user.name || ''} src={answer.user.avatar} />
                  <Typography variant="small">@{answer.user.name}</Typography>
                </Link>
                <div className="w-full">
                  <MarkdownView>{answer.body}</MarkdownView>
                  <div className="mt-6 text-sm">
                    <Link href={`/u/${answer.user.handle}`} className="text-gray-600 hover:underline">
                      @{answer.user.name}
                    </Link>
                    <span className="text-xs text-gray-500 mx-1">created at</span>
                    <Link href={`/answers/${answer.id}`} className="text-gray-600 hover:underline">
                      {formatRelativeTime(answer.createdAt)}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
                    <div className="flex flex-col">
                      <Link href={`/answers/${answer.id}`}>
                        <Typography variant="h3">
                          {formatEther(answer.pricePerShare)}
                          <span className="font-light text-sm ml-1.5">ACA / Share</span>
                        </Typography>
                      </Link>
                    </div>
                    <ButtonGroup size="sm" color="yellow">
                      <Button onClick={() => setBuyAnswerId(answer.id)}>Buy</Button>
                      <Button onClick={() => setSellAnswerId(answer.id)}>Sell</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
          {/* <CardFooter> */}
          {/*   <Button onClick={onAddAnswer}>Add my answer</Button> */}
          {/* </CardFooter> */}
        </Card>
      ) : (
        <Card key={question.id} className="w-full rounded-3xl px-8 py-6 bg-[#f9e8e6]" shadow={false}>
          <div className="flex flex-row gap-8 items-center justify-between p-4">
            <div className="flex flex-col gap-1.5">
              <Link href={`/questions/view/${question.id}`} className="hover:underline">
                <Typography variant="h5">
                  {question.title}
                </Typography>
              </Link>
              <Link href={`/u/${question.user.handle}`} className="flex flex-row items-center gap-2.5">
                <Avatar
                  src={question.user.avatar}
                  alt="avatar"
                  className="border border-gray-400 p-0.5"
                  size="xs"
                />
                <Typography className="hover:underline">
                  @{question.user.name}
                </Typography>
              </Link>
              <div className="border-t border-solid border-gray-300 text-gray-600 text-sm mt-4">
                Created at {formatRelativeTime(question.createdAt)}
              </div>
            </div>
            <div className="ml-2.5 flex flex-col items-end">
              <div>
                <span className="slashed-zero lining-nums font-medium text-2xl text-red-600">{formatNumber(formatUnits(question.totalDeposit, 10))}</span>
                <span className="text-gray-600 font-extralight text-sm ml-1">DOT</span>
              </div>
              <RewardsSuffix value={question.totalDeposit} createdAt={question.createdAt} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
