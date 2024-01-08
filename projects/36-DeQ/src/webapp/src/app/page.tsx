import { Tabs, TabList, TabPanel } from 'react-aria-components'

import { Tab } from '@/components/Tabs'
import { QuestionList } from '@/components/QuestionList'
import { useTrpcPreload } from '@/server/appRouter'
import { RehydrateHandler } from '@/server/trpcProvider'

export const metadata = {
  title: 'DeQ',
}

export default async function Home() {
  const trpc = await useTrpcPreload()
  // await Promise.all([
  //   trpc.questions.lastest.prefetch({ type: 'hot' }),
  //   trpc.questions.lastest.prefetch({ type: 'unanswer' }),
  // ])

  return (
    <RehydrateHandler data={trpc.dehydrate()}>
      <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen pb-8">
        <Tabs className="w-full">
          <TabList className="flex space-x-1 rounded-full bg-green-900/40 bg-clip-padding p-1 border border-solid border-white/30 mb-4">
            <Tab id="hot">Hot</Tab>
            <Tab id="bounty">Bounty</Tab>
          </TabList>
          <TabPanel id="hot">
            <QuestionList type="hot" />
          </TabPanel>
          <TabPanel id="bounty">
            <QuestionList type="unanswer" />
          </TabPanel>
        </Tabs>
      </main>
    </RehydrateHandler>
  )
}
