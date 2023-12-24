'use client';

import { Spinner } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'
import { AnswerCard } from '@/components/AnswerCard'

export function UserHoldings({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.holdings.useQuery({ handle })
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2.5">
      {data?.items?.map(({ answer }) => (
        <AnswerCard answer={answer} key={answer.id} />
      ))}
      {data?.items?.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Empty</div>
      ) : null}
    </div>
  )
}
