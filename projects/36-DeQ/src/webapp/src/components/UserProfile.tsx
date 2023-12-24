'use client';

import Link from 'next/link'
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'

export function UserProfile({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.info.useQuery({ handle })
  return (
    <Card className="grow" shadow={false}>
      <CardBody>
        {data?.user ? (
          <div className="flex flex-row gap-2 items-center">
            <Link href={`/u/${data.user.handle}`}>
              <Avatar
                src={data.user.avatar}
                alt="avatar"
                className="border border-gray-400 p-0.5"
              />
            </Link>
            <div>
              <Typography className="font-medium text-2xl">
                <Link href={`/u/${data.user.handle}`}>
                  @{data.user.name}
                </Link>
              </Typography>
              <code className="text-xs text-gray-500">
                {data.user.address}
              </code>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
