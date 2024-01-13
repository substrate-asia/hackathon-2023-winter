'use client';

import Link from 'next/link'
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'
import cn from '@/utils/cn'

function NumStats({ num, unit, label }: { num: number | string, unit?: string, label: string }) {
  return(
    <div className="flex flex-col items-center">
      <span>
        <big className="text-2xl font-bold tabular-nums">{num}</big>
        {unit ? <span className="text-gray-700 text-sm ml-0.5">{unit}</span> : ''}
      </span>
      <span className="text-gray-400 text-sm relative -top-[0.5]">{label}</span>
    </div>
  )
}

export function UserProfile({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.info.useQuery({ handle })
  const avatar = data?.user?.avatar ?? '/logo.png'
  return (
    <Card className="grow" shadow={false}>
      <CardBody>
        {data?.user ? (
          <div>
            <div className="flex flex-row gap-2 items-center">
              <Link href={`/u/${data.user.handle}`} className="flex-1 min-w-[4rem]">
                <Avatar
                  src={avatar}
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
            <div
              className={cn(
                "border-t border-solid border-gray-200 mt-4 leading-none pt-4",
                "grid grid-cols-3"
              )}
            >
              <NumStats num={10} label="answers" />
              <NumStats num={20} unit="DOT" label="rewards" />
              <NumStats num={8} label="holders" />
            </div>
          </div>
        ) : ''}
      </CardBody>
    </Card>
  )
}
