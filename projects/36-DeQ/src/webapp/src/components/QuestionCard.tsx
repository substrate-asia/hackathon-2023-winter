import type { Question } from '@/server/appRouter'

import Link from 'next/link'
import { Card, CardBody, Typography, Avatar, ButtonGroup, Button } from '@material-tailwind/react'
import { formatEther, formatUnits } from "viem"
import { useSetAtom } from "jotai"

import { MarkdownView } from '@/components/MarkdownView'
import { formatRelativeTime } from "@/utils/datetime"
import { formatNumber } from '@/utils/number'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'

export function QuestionCard({ question }: { question: Question }) {
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  return (
    <Card key={question.id} className="w-full rounded-3xl px-6 py-6" shadow={false}>
      <header className="flex flex-row gap-2.5 items-center justify-between px-12 py-4 rounded-3xl bg-gray-900 text-gray-50">
        <div className="flex flex-col gap-1.5">
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
        <div className="ml-2.5">
          <span className="slashed-zero lining-nums font-bold text-2xl text-white">
            {formatNumber(formatUnits(question.totalDeposit, 10))}
          </span>
          <span className="text-gray-200 font-extralight text-sm ml-1">DOT</span>
        </div>
      </header>
      <CardBody className="flex flex-col">
        {question.answers.map((answer) => (
          <div key={answer.id} className="flex flex-row gap-4 items-start">
            <Link href={`/u/${answer.user.handle}`} className="w-24 flex-shrink-0 flex flex-col items-center justify-center gap-1.5">
              <Avatar variant="circular" alt={answer.user.name || ''} src={answer.user.avatar} />
              <Typography variant="small">@{answer.user.name}</Typography>
            </Link>
            <div className="w-full">
              <MarkdownView>{answer.body}</MarkdownView>
              <div className="mt-4">
                <Link href={`/u/${answer.user.handle}`}>
                  @{answer.user.name}
                </Link> <span className="text-sm text-gray-500">created at</span> <Link href={`/answers/${answer.id}`}>{formatRelativeTime(answer.createdAt)}</Link>
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
                <ButtonGroup size="sm" variant="gradient" color="amber">
                  <Button onClick={() => setBuyAnswerId(answer.id)}>Buy</Button>
                  <Button onClick={() => setSellAnswerId(answer.id)}>Sell</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
