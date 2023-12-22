'use client';

import { useSetAtom } from 'jotai'
import {
  Avatar,
  Card,
  CardBody,
  Typography,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  ButtonGroup,
} from '@material-tailwind/react'
import Link from 'next/link'
import { formatEther } from 'viem'

import { MarkdownView } from '@/components/MarkdownView'
import { TradeList } from '@/components/TradeList'
import { HolderList } from '@/components/HolderList'
import { trpcQuery } from '@/server/trpcProvider'
import { formatRelativeTime } from '@/utils/datetime'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'


export function AnswerView({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.answers.getById.useQuery({ id })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  return (
    <Card className="w-full rounded-3xl px-8 py-6" shadow={false}>
      <CardBody>
        {isLoading ? <Spinner className="mx-auto" /> : null}
        {data ? (
          <div className="flex flex-col gap-4">
            <header className="border-b border-gray-100 pb-2.5">
              <Link href={`/questions/view/${data.question.id}`}>
                <Typography variant="h4">{data.question.title}</Typography>
              </Link>
            </header>
            <div className="flex flex-row gap-2 items-center">
              <Link href={`/u/${data.user.handle}`}>
                <Avatar
                  src={data.user.avatar}
                  alt="avatar"
                  className="border border-gray-400 p-0.5"
                />
              </Link>
              <div>
                <Typography className="font-medium">
                  <Link href={`/u/${data.user.handle}`}>
                    @{data.user.name}
                  </Link>
                </Typography>
                <Typography className="text-xs text-gray-500">
                  {formatRelativeTime(data.createdAt)}
                </Typography>
              </div>
            </div>
            <MarkdownView>
              {data.body}
            </MarkdownView>
          </div>
        ) : null}
        <div className="mt-4 border-t border-gray pt-4 flex flex-row justify-between items-center">
          <div>
            <Typography variant="h3">
              {formatEther(data?.pricePerShare || BigInt(0))}
              <span className="font-light text-sm ml-1.5">ACA / Share</span>
            </Typography>
          </div>
          <ButtonGroup variant="gradient" color="amber">
            <Button onClick={() => setBuyAnswerId(id)}>Buy</Button>
            <Button onClick={() => setSellAnswerId(id)}>Sell</Button>
          </ButtonGroup>
        </div>
      </CardBody>
    </Card>
  )
}

export function AnswerData({ id }: { id: number }) {
  const { data } = trpcQuery.answers.getById.useQuery({ id })
  return (
    <div className='w-full px-16 pb-8'>
      <Tabs value="trades">
        <TabsHeader>
          <Tab value="trades">Recent Trades</Tab>
          <Tab value="holders">Holders</Tab>
          <Tab value="overview">Overview</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="trades">
            <TradeList tokenId={id} />
          </TabPanel>
          <TabPanel value="holders">
            <HolderList tokenId={id} />
          </TabPanel>
          <TabPanel value="overview">
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="h6" className="font-normal">Total Value in the Pool</Typography>
                <Typography variant="h3">
                  {formatEther(data?.values ?? BigInt(0))}
                  <span className="font-light text-sm ml-1.5">ACA</span>
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className="font-normal">Share Supply</Typography>
                <Typography variant="h3">
                  {formatEther(data?.shares ?? BigInt(0))}
                  <span className="font-light text-sm ml-1.5">Shares</span>
                </Typography>
              </div>
            </div>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  )
}
