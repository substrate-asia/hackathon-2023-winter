import { redirect } from 'next/navigation'
import { Tabs, TabList, TabPanel } from 'react-aria-components'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Profile } from '@/components/Profile'
import { Tab } from '@/components/Tabs'
import { UserHoldings } from '@/components/UserHoldings'
import { UserRewards } from '@/components/UserRewards'
import { UserAnswers } from '@/components/UserAnwsers'

export const metadata = {
  title: 'DeQ - My Profile',
}

export default async function UserDetailPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id && !(session?.user?.handle)) {
    return redirect('/')
  }
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8 pb-16">
      <Profile />
      <Tabs className="w-full">
        <TabList className="flex space-x-1 rounded-full bg-green-900/40 bg-clip-padding p-1 border border-solid border-white/30 mb-4">
          <Tab id="rewards">Rewards</Tab>
          <Tab id="answers">Answers</Tab>
          <Tab id="holdings">Holdings</Tab>
        </TabList>
        <TabPanel id="rewards">
          <UserRewards handle={session.user.handle!} />
        </TabPanel>
        <TabPanel id="answers">
          <UserAnswers handle={session.user.handle!} />
        </TabPanel>
        <TabPanel id="holdings">
          <UserHoldings handle={session.user.handle!} />
        </TabPanel>
      </Tabs>
    </main>
  )
}
