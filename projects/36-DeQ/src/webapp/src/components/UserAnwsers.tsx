'use client';

import { Spinner } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'
import { QuestionCard } from '@/components/QuestionCard'

export function UserAnswers({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.answers.useQuery({ handle })
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2.5">
      {data?.items?.map((question) => (
        <QuestionCard question={question} key={question.id} />
      ))}
      {data?.items?.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Empty</div>
      ) : null}
    </div>
  )
}
