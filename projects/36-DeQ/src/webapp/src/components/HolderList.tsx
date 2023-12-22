'use client';

import Link from 'next/link'
import { Spinner, Avatar } from '@material-tailwind/react'
import { formatEther } from 'viem'

import { trpcQuery } from '@/server/trpcProvider'

export function HolderList({ tokenId }: { tokenId: number }) {
  const { data, isLoading } = trpcQuery.answers.holders.useQuery({ tokenId })
  return (
    <div>
      {isLoading ? (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
      ) : null}
      <div className="flex flex-col gap-2.5">
        {data && data.items.map(rec => (
          <div
            key={rec.id}
          >
            <div className="flex flex-row gap-2.5 items-center">
              <Link href={`/u/${rec.user.handle}`} className="flex flex-row items-center gap-1.5 hover:underline">
                <Avatar
                  src={rec.user.avatar}
                  alt="avatar"
                  className="border border-gray-400 p-0.5"
                  size="xs"
                />
                <div>{rec.user.name}</div>
              </Link>
              <div className="text-sm">
                <code>{rec.user.address}</code>
              </div>
              <div className="flex flex-row gap-1 text-gray-600">
                <span className="slashed-zero lining-nums font-medium">{formatEther(rec.shares)}</span>
                shares
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
