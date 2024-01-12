'use client';

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as R from 'ramda'
import {
  Card,
  CardBody,
  Textarea,
  Button,
} from '@/components/material-tailwind'
import {
  useConnect,
  useAccount,
  useContractRead,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi'
import { parseAbi } from 'viem'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { ANSWER_CONTRACT_ADDRESS, abis } from '@/features/answers/requests'

import { trpcQuery } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

export function AnswerForm({ questionId }: { questionId: number }) {
  const queryClient = useQueryClient()
  const { isLoading, mutateAsync } = trpcQuery.answers.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
  const { mutateAsync: uploadMetadata, isLoading: uploading } = trpcQuery.answers.uploadMetadata.useMutation()

  const { address, isConnected } = useAccount()
  const { data: walletClient, isLoading: walletIsLoading } = useWalletClient()
  const { connect } = useConnect({ connector: new InjectedConnector() })

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({ chainId: mandala.id })
  const needSwitchChain = chain?.id !== mandala.id

  const { data: nextId } = useContractRead({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'nextId',
  })

  const handleSubmit= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!walletClient) {
      return
    }
    if (!nextId) {
      console.log('Error: nextId should not empty.')
      return
    }
    const tokenId = Number(nextId)
    const body = R.pathOr('', ['target', 'body', 'value'], e)
    const { uri } = await uploadMetadata({
      questionId: Number(questionId),
      tokenId,
      body
    })
    const hash = await walletClient.writeContract({
      chain: mandala,
      address: ANSWER_CONTRACT_ADDRESS,
      abi: parseAbi(abis),
      functionName: 'create',
      args: [address!, BigInt(questionId), uri],
    })
    console.log('block hash', hash)
    await mutateAsync({ questionId, tokenId, body })
    ;(e.target as HTMLFormElement)?.reset()
  }

  return (
    <div className="w-full">
      <Card>
        <CardBody>
          {isLoading && <div>Loading...</div>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Textarea
                name="body"
                size="lg"
              />
              <div className="flex justify-end mt-4">
                <Button loading={isLoading || walletIsLoading || uploading} type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
