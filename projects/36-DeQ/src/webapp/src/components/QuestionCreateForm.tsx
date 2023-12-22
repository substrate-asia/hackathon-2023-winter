'use client';

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as R from 'ramda'
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Stepper,
  Step,
  Spinner,
  Alert,
} from '@/components/material-tailwind'
import { FaCubesStacked, FaWallet, FaLink } from 'react-icons/fa6'
import { IoMdCreate } from 'react-icons/io'
import {
  usePublicClient,
  useWalletClient,
  useConnect,
  useAccount,
  useContractRead,
} from 'wagmi'
import { parseUnits, parseAbi } from 'viem'
import { getContract } from 'wagmi/actions'
import { InjectedConnector } from '@wagmi/connectors/injected'
import Homa from '@acala-network/contracts/build/contracts/Homa.json'
import { HOMA } from '@acala-network/contracts/utils/Predeploy'
import { LDOT } from '@acala-network/contracts/utils/MandalaTokens'
import Decimal from 'decimal.js'

import { trpcQuery } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

const erc20_abis = [
  'function approve(address spender, uint256 value) external returns (bool)'
]

const question_nft_abis = [
  'function createReward(uint256 questionId, uint256 amount) public',
]

export function QuestionCreateForm() {
  const queryClient = useQueryClient()
  const { data: walletClient, isLoading: walletIsLoading } = useWalletClient()
  const { isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)
  const [dot, setDot] = useState('')
  const [activeStep, setActiveStep] = useState(-1)
  const [hash1, setHash1] = useState('')
  const [hash2, setHash2] = useState('')
  const [hash3, setHash3] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  const { mutate, isLoading } = trpcQuery.questions.create.useMutation({
    onSuccess: (data) => {
      console.info(data)
      deposit(data.id)
      queryClient.invalidateQueries(['questions.lastest'])
    }
  })

  const { data: rate, isLoading: rateIsLoading } = useContractRead({
    address: HOMA,
    abi: Homa.abi,
    functionName: 'getExchangeRate',
  })

  const deposit = async (questionId: number) => {
    setErrorMsg('')
    if (!walletClient) {
      return
    }
    if (!dot) {
      alert('Please price your offer')
      return
    }
    try {
      setLoading(true)
      setActiveStep(0)
      console.info(dot, parseUnits(dot, 10))
      // stack
      const hash1 = await walletClient.writeContract({
        chain: mandala,
        address: HOMA,
        abi: Homa.abi,
        functionName: 'mint',
        args: [parseUnits(dot, 10)]
      })
      console.info(hash1)
      await publicClient.waitForTransactionReceipt({
        hash: hash1,
        confirmations: 2,
        timeout: 300_000,
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash1}`)
      setHash1(hash1)

      const ldot = new Decimal(dot).div(Decimal.div((rate as bigint).toString(), parseUnits('1', 18).toString())).toString()

      const contractAddress = '0xC6C850C3455076da5726201a21593D537Ed58189'
      console.log('contractAddress:', contractAddress)

      // approve to transfer LDOT
      setActiveStep(1)
      const hash2 = await walletClient.writeContract({
        chain: mandala,
        address: LDOT,
        abi: parseAbi(erc20_abis),
        functionName: 'approve',
        args: [contractAddress, parseUnits(ldot, 10)]
      })
      console.info(hash2)
      await publicClient.waitForTransactionReceipt({
        hash: hash2,
        confirmations: 2,
        timeout: 300_000,
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash2}`)
      setHash2(hash2)

      // createReward
      setActiveStep(2)
      const hash3 = await walletClient.writeContract({
        chain: mandala,
        address: contractAddress,
        abi: parseAbi(question_nft_abis),
        functionName: 'createReward',
        args: [questionId, parseUnits(ldot, 10)]
      })
      console.info(hash3)
      await publicClient.waitForTransactionReceipt({
        hash: hash3,
        confirmations: 2,
        timeout: 300_000,
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash3}`)
      setHash3(hash3)
      setLoading(false)
      // redirect to question detail page
      setOpen(true)
      setTimeout(() => {
        router.replace(`/questions/view/${questionId}`)
      }, 1_000 * 10)
    } catch (error) {
      setLoading(false)
      setErrorMsg(R.pathOr('Fail to Submit', ['message'], error))
      console.error(error)
    }
  }

  const handleSubmit= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      title: R.pathOr('', ['target', 'title', 'value'], e),
      body: R.pathOr('', ['target', 'body', 'value'], e),
      amount: parseUnits(dot, 10),
    })
  }

  return (
    <div className="w-[700px] m-x-auto">
      <Alert className="mb-4" color="green" open={open} onClose={() => setOpen(false)}>
        Created successfully, will jump to the question after 10s.
      </Alert>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Typography variant="h6" color="blue-gray" className="">
                  Title
                </Typography>
                <Input
                  name="title"
                  size="lg"
                  label="Title"
                  required
                />
              </div>
              <Textarea
                name="body"
                size="lg"
                label="Details"
              />
              <div className="flex flex-col gap-2">
                <Typography variant="h6" color="blue-gray" className="">
                  Price you offer
                </Typography>
                <Input
                  name="dot"
                  value={dot}
                  onChange={(e) => setDot(e.target.value)}
                  size="lg"
                  label="Min Price is 1 DOT"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button loading={isLoading || walletIsLoading || loading} type="submit">Submit</Button>
              </div>
            </div>
          </form>
          {
            activeStep > -1 ? (
              <div className="w-full px-24 py-4 pb-20 mt-8">
                <Stepper
                  activeStep={activeStep}
                >
                  <Step>
                    <FaCubesStacked className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                      <Typography
                        variant="h6"
                        color={activeStep === 0 ? "blue-gray" : "gray"}
                      >
                        Stack
                      </Typography>
                      <div className="absolute w-full flex justify-center items-center">
                        {
                          activeStep === 0 && loading ? (
                            <Spinner className="w-4" />
                          ) : null
                        }
                        {
                          hash1 ? (
                            <a className="flex justify-center items-center gap-2 text-gray-600 text-sm" href={`https://blockscout.mandala.aca-staging.network/tx/${hash1}`} target="_blank">
                              <FaLink /> <span>TX</span>
                            </a>
                          ) : null
                        }
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <FaWallet className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                      <Typography
                        variant="h6"
                        color={activeStep === 1 ? "blue-gray" : "gray"}
                      >
                        Approve
                      </Typography>
                      <div className="absolute w-full flex justify-center items-center">
                        {
                          activeStep === 1 && loading ? (
                            <Spinner className="w-4" />
                          ) : null
                        }
                        {
                          hash2 ? (
                            <a className="flex justify-center items-center gap-2 text-gray-600 text-sm" href={`https://blockscout.mandala.aca-staging.network/tx/${hash2}`} target="_blank">
                              <FaLink /> <span>TX</span>
                            </a>
                          ) : null
                        }
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <IoMdCreate className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                      <Typography
                        variant="h6"
                        color={activeStep === 2 ? "blue-gray" : "gray"}
                      >
                        Create
                      </Typography>
                      <div className="absolute w-full flex justify-center items-center">
                        {
                          activeStep === 2 && loading ? (
                            <Spinner className="w-4" />
                          ) : null
                        }
                        {
                          hash3 ? (
                            <a className="flex justify-center items-center gap-2 text-gray-600 text-sm" href={`https://blockscout.mandala.aca-staging.network/tx/${hash3}`} target="_blank">
                              <FaLink /> <span>TX</span>
                            </a>
                          ) : null
                        }
                      </div>
                    </div>
                  </Step>
                </Stepper>
              </div>
            ) : null
          }
          {
            errorMsg ? (
              <div className="text-center text-red-600 py-2">{errorMsg}</div>
            ) : null
          }
        </CardBody>
      </Card>
    </div>
  )
}
