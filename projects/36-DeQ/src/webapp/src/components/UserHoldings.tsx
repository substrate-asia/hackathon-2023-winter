'use client';

import Link from 'next/link'
import { Spinner, Avatar, Chip, Card, CardBody, Typography } from '@material-tailwind/react'
import { formatEther } from 'viem'

import { trpcQuery } from '@/server/trpcProvider'

export function Holdings({ userId }: { userId: number }) {
  const { data, isLoading } = trpcQuery.users.holdings.useQuery({
    userId
  })
  return (
    <div>
      <h2 className="text-2xl font-semibold">Holdings</h2>
      {isLoading ? (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2.5">
        {data && data.items.map(rec => (
          <Card
            key={rec.id}
          >
            <Link href={`/answers/${rec.answer.id}`} target="_blank">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Answer
                </Typography>
                <Typography>{rec.answer.body}</Typography>
              </CardBody>
            </Link>
          </Card>
        ))}
        {
          !isLoading && data && data.items.length === 0 ? (
            <div className="text-center text-gray-600 py-4">Empty</div>
          ) : null
        }
      </div>
    </div>
  )
}

export function UserHoldings({ handle }: { handle: string }) {
  const { data: userData } = trpcQuery.users.info.useQuery({ handle })
  if (!userData) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <Holdings userId={userData.user.id} />
  )
}
