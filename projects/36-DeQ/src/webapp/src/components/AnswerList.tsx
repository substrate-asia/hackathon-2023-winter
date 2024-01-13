'use client';

import { useState } from 'react'
import { trpcQuery } from '@/server/trpcProvider'
import Link from 'next/link'
import {
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Avatar,
  ButtonGroup,
} from '@material-tailwind/react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { parseAbi, formatEther } from 'viem'
import {
  usePublicClient,
  useWalletClient,
} from 'wagmi'
import { useSetAtom } from 'jotai'

import { MarkdownView } from '@/components/MarkdownView'
import { formatRelativeTime } from '@/utils/datetime'
import { mandala } from '@/utils/chains'
import cn from '@/utils/cn'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'

const question_nft_abis = [
  'function grantReward(uint256 questionId, address answerer) public',
]

export function AnswerList({ id }: { id: number }) {
  const { data: walletClient, isLoading: walletIsLoading } = useWalletClient()
  const queryClient = useQueryClient()
  const publicClient = usePublicClient()
  const { data: session } = useSession()
  const { data, isLoading } = trpcQuery.answers.getByQuestionId.useQuery({ id })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)

  const { mutate, isLoading: picking } = trpcQuery.answers.pick.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
  const [pending, setPending] = useState(false)

  const handlePick = async (answer: any) => {
    if (!walletClient) {
      return
    }
    try {
      setPending(true)
      const hash = await walletClient.writeContract({
        chain: mandala,
        address: '0xC6C850C3455076da5726201a21593D537Ed58189',
        abi: parseAbi(question_nft_abis),
        functionName: 'grantReward',
        args: [answer.question.id, answer.user.address]
      })
      await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 2,
        timeout: 300_000,
      })
      setPending(false)
      mutate({ id: answer.id, picked: true })
    } catch(error) {
      console.error(error)
      setPending(false)
    }
  }

  const movePickedToFront = (answers: any[]) => {
    const pickedAnswers = answers.filter(answer => answer.picked)
    const unpickedAnswers = answers.filter(answer => !answer.picked)
    return pickedAnswers.concat(unpickedAnswers)
  }

  const sorted = data ? movePickedToFront(data.items) : []

  return (
    <div className="flex flex-col align-center gap-8 pl-8">
      {
        isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
        ) : null
      }
      {sorted.map(answer => (
        <Card
          key={answer.id}
          shadow={false}
          className={cn("w-full rounded-3xl p-8 pt-4", answer?.picked ? "bg-[#eef9fd]" : "bg-[#faf3e8]")}
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
            <div className="flex justify-between items-end mt-2 border-t border-gray-300 pt-2">
              <div className="flex flex-rol gap-2 items-end">
                <div className="flex flex-col">
                  <Link href={`/answers/${answer.id}`}>
                    <Typography variant="h3">
                      {formatEther(answer.pricePerShare)}
                      <span className="font-light text-sm ml-1.5">ACA / Share</span>
                    </Typography>
                  </Link>
                </div>
                {answer.values > 0 ? (
                  <div className="inline-flex flex-row gap-1.5 relative -top-0.5">
                    <span>
                      {formatEther(answer.values || 0)} <small className="font-light text-xs">ACA in pool,</small>
                    </span>
                    <span>
                      {formatEther(answer.shares || 0)} <small className="font-light text-xs">Shares,</small>
                    </span>
                    <span>
                      {answer.holders} <small className="font-light text-xs">Holders</small>
                    </span>
                  </div>
                ) : null}
              </div>
              <ButtonGroup size="sm" color="yellow">
                <Button onClick={() => setBuyAnswerId(answer.id)}>Buy</Button>
                <Button onClick={() => setSellAnswerId(answer.id)}>Sell</Button>
              </ButtonGroup>
            </div>
          </CardBody>
          {
            session && session.user && session.user.id === answer.question_creator_id && sorted.length > 0 && !sorted[0].picked ? (
              <CardFooter>
                <Button loading={pending || picking || walletIsLoading} onClick={() => handlePick(answer)}>Pick</Button>
              </CardFooter>
            ) : null
          }
        </Card>
      ))}
    </div>
  )
}
