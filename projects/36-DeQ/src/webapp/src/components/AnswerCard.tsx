import type { Answer } from '@/server/appRouter'

import Link from 'next/link'
import { Card, CardBody, Avatar, Typography, ButtonGroup, Button } from '@material-tailwind/react'
import { formatEther } from 'viem'
import { useSetAtom } from 'jotai'

import { MarkdownView } from '@/components/MarkdownView'
import cn from '@/utils/cn'
import { formatRelativeTime } from '@/utils/datetime'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'

export function AnswerCard({ answer }: { answer: Omit<Answer, 'question_creator_id'> }) {
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  return (
    <Card
      shadow={false}
      className={cn("w-full rounded-3xl p-8 pt-4")}
    >
      <CardBody className="flex flex-col gap-4">
        <header className="pb-2.5 border-b border-gray-300">
          <div className="flex flex-row gap-2 items-center">
            <Link href={`/u/${answer.user.handle}`}>
              <Avatar
                src={answer.user.avatar}
                alt="avatar"
                className="border border-gray-400 p-0.5"
              />
            </Link>
            <div>
              <Typography className="font-medium">
                <Link href={`/u/${answer.user.handle}`}>
                  @{answer.user.name}
                </Link>
              </Typography>
              <Link href={`/answers/${answer.id}`}>
                <Typography className="text-xs text-gray-700 hover:underline">
                  {formatRelativeTime(answer.createdAt)}
                </Typography>
              </Link>
            </div>
          </div>
        </header>
        <MarkdownView>
          {answer.body}
        </MarkdownView>
        <div className="flex justify-between items-center mt-2 border-t border-gray-300 pt-2">
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
      </CardBody>
    </Card>
  )
}
