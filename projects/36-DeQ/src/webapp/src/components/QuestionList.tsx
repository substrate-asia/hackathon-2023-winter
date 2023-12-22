'use client';

import Link from 'next/link'
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
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'
import { formatRelativeTime } from '@/utils/datetime';

export function QuestionList({ type }: { type: 'hot' | 'unanswer' }) {
  const { data, isLoading } = trpcQuery.questions.lastest.useQuery({ type })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  const onAddAnswer = () => {
    console.log('onAddAnswer')
  }
  if (isLoading) {
    return <Spinner />
  }
  return (
    <div className="flex flex-col align-center gap-8">
      {data && data.items.map(question => question.answers.length > 0 ? (
        <Card key={question.id} className="w-full rounded-3xl px-8 py-6" shadow={false}>
          <div className="flex flex-row gap-4 items-center p-4 rounded-3xl bg-gray-900 text-gray-50">
            <Link href={`/u/${question.user.handle}`} className="flex flex-row items-center gap-2.5">
              <Avatar
                src={question.user.avatar}
                alt="avatar"
                className="border border-gray-400 p-0.5"
                size="sm"
              />
              <Typography className="hover:underline">
                @{question.user.name}
              </Typography>
            </Link>
            <Link href={`/questions/view/${question.id}`}>
              <Typography variant="h5" className="hover:underline">
                <q className="px-1.5">{question.title}</q>
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
                  <div className="mt-2.5">
                    <Link href={`/u/${answer.user.handle}`}>
                      @{answer.user.name}
                    </Link> <span className="text-sm text-gray-500">Created at</span> <Link href={`/answers/${answer.id}`}>{formatRelativeTime(answer.createdAt)}</Link>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
                    <div className="flex flex-col">
                      <Typography variant="h3">
                        {formatEther(answer.pricePerShare)}
                        <span className="font-light text-sm ml-1.5">ACA / Share</span>
                      </Typography>
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
          {/* <CardFooter> */}
          {/*   <Button onClick={onAddAnswer}>Add my answer</Button> */}
          {/* </CardFooter> */}
        </Card>
      ) : (
        <Card key={question.id} className="w-full rounded-3xl px-8 py-6 bg-[#f9e8e6]" shadow={false}>
          <div className="flex flex-row gap-4 items-center p-4">
            <Link href={`/u/${question.user.handle}`} className="flex flex-row items-center gap-2.5">
              <Avatar
                src={question.user.avatar}
                alt="avatar"
                className="border border-gray-400 p-0.5"
                size="sm"
              />
              <Typography className="hover:underline">
                @{question.user.name}
              </Typography>
            </Link>
            <Link href={`/questions/view/${question.id}`} className="hover:underline">
              <Typography variant="h5">
                <q className="px-1.5">{question.title}</q>
              </Typography>
            </Link>
            <div className="ml-2.5">
              <span className="slashed-zero lining-nums font-medium text-2xl text-red-600">{formatUnits(question.totalDeposit, 10)}</span>
              <span className="text-gray-600 font-extralight text-sm ml-1">DOT</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
