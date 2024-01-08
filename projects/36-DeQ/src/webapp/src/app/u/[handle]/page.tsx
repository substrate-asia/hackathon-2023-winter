import { Tabs, TabList, TabPanel } from 'react-aria-components'

import { QuestionCreateForm } from '@/components/QuestionCreateForm'
import { Tab } from '@/components/Tabs'
import { UserHoldings } from '@/components/UserHoldings'
import { UserProfile } from '@/components/UserProfile'
import { UserRewards } from '@/components/UserRewards'
import { UserAnswers } from '@/components/UserAnwsers'

interface PageParams {
  handle: string
}

export const metadata = {
  title: 'DeQ - User',
}
export default function UserDetailPage({ params: { handle } }: { params: PageParams }) { 
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-12 pb-12">
      <div className="flex flex-row gap-4">
        <div className="self-stretch grow">
          <UserProfile handle={handle} />
        </div>
        <QuestionCreateForm
          actionButtonLabel="Send Offer"
        />
      </div>
      <Tabs className="w-full">
        <TabList className="flex space-x-1 rounded-full bg-green-900/40 bg-clip-padding p-1 border border-solid border-white/30 mb-4">
          <Tab id="rewards">Rewards</Tab>
          <Tab id="answers">Answers</Tab>
          <Tab id="holdings">Holdings</Tab>
        </TabList>
        <TabPanel id="rewards">
          <UserRewards handle={handle} />
        </TabPanel>
        <TabPanel id="answers">
          <UserAnswers handle={handle} />
        </TabPanel>
        <TabPanel id="holdings">
          <UserHoldings handle={handle} />
        </TabPanel>
      </Tabs>
    </main>
  )
}
