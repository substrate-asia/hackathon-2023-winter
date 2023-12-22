'use client';

import Link from 'next/link'
import {
  Avatar,
  Card,
  CardBody,
  Spinner,
  Typography,
} from '@material-tailwind/react'
import { formatUnits } from 'viem'

import { MarkdownView } from '@/components/MarkdownView'
import { trpcQuery } from '@/server/trpcProvider'
import { formatRelativeTime } from '@/utils/datetime'

export function QuestionView({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.questions.getById.useQuery({ id })
  return (
    <Card className="w-full rounded-3xl px-8 py-6" shadow={false}>
      <CardBody>
        {isLoading ? <Spinner className="mx-auto" /> : null}
        {data ? (
          <div className="flex flex-col gap-4">
            <header className="border-b border-gray-100 pb-2.5 flex flex-row justify-between items-center">
              <Link href={`/questions/view/${data.id}`}>
                <Typography variant="h4">{data.title}</Typography>
              </Link>
              <div className="ml-2.5">
                <span className="slashed-zero lining-nums font-medium text-2xl text-red-600">{formatUnits(data.totalDeposit, 10)}</span>
                <span className="text-gray-600 font-extralight text-sm ml-1">DOT</span>
              </div>
            </header>
            <div className="flex flex-row gap-2 items-center">
              <Link href={`/u/${data.user.handle}`}>
                <Avatar
                  src={data.user.avatar}
                  alt="avatar"
                  className="border border-gray-400 p-0.5"
                />
              </Link>
              <div>
                <Typography className="font-medium">
                  <Link href={`/u/${data.user.handle}`}>
                    @{data.user.name}
                  </Link>
                </Typography>
                <Typography className="text-xs text-gray-500">
                  {formatRelativeTime(data.createdAt)}
                </Typography>
              </div>
            </div>
            <MarkdownView>
              {data.body}
            </MarkdownView>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
