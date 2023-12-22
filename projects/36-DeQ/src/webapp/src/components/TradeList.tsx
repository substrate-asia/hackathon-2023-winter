'use client';

import Link from 'next/link'
import { Spinner, Avatar, Chip } from '@material-tailwind/react'
import { formatEther } from 'viem'

import { trpcQuery } from '@/server/trpcProvider'

export function TradeList({ tokenId }: { tokenId: number }) {
  const { data, isLoading } = trpcQuery.answers.tradeHistory.useQuery({ tokenId })
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
            <div className="flex flex-row gap-2 items-center">
              {rec.user ? (
                <Link href={`/u/${rec.user.handle}`} className="flex flex-row items-center gap-1.5 hover:underline">
                  <Avatar
                    src={rec.user.avatar}
                    alt="avatar"
                    className="border border-gray-400 p-0.5"
                    size="xs"
                  />
                  <div>{rec.user.name}</div>
                </Link>
              ) : (
                <div className="flex flex-row items-center gap-1.5">
                  <Avatar
                    src={`https://effigy.im/a/${rec.address}.png`}
                    alt="avatar"
                    className="border border-gray-400 p-0.5"
                    size="xs"
                  />
                  <div className="text-ellipsis overflow-hidden w-24">{
                    rec.address.substring(0, 4)
                    + '...'
                    + rec.address.substring(rec.address.length - 4)
                  }</div>
                </div>
              )}
              <Chip
                value={rec.type}
                size="sm"
                color={rec.type === "CREATED" ? "gray" : (rec.type === "SOLD" ? "red" : "green")}
                variant={rec.type === "CREATED" ? "outlined" : "filled"}
              />
              <div className="flex flex-row gap-1 text-gray-600">
                <span className="slashed-zero lining-nums font-medium">{formatEther(rec.amount)}</span>
                <span>share for</span>
                <span className="slashed-zero lining-nums font-medium">{formatEther(rec.tokens)}</span>
                <span>ACA</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
