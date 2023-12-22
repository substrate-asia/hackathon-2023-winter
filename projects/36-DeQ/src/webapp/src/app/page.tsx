import { useTrpcPreload } from '@/server/appRouter'
import { RehydrateHandler } from '@/server/trpcProvider'
import { QuestionList } from '@/components/QuestionList'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tab,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
} from "@/components/material-tailwind";
import AskButton from '@/components/AskButton'

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
      <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8 items-center">
        <AskButton />
        <div className="flex flex-col">
          <Tabs value="Hot" className="pt-6 mt-6">
            <TabsHeader >
              <Tab key="Hot" value="Hot">
                Hot
              </Tab>
              <Tab key="Unanswer" value="Unanswer">
                Unanswer
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel key="Hot" value="Hot">
                <QuestionList type="hot" />
              </TabPanel>
              <TabPanel key="Unanswer" value="Unanswer">
                <QuestionList type="unanswer" />
              </TabPanel>
            </TabsBody>
          </Tabs >
        </div>
      </main>
    </RehydrateHandler>
  )
}
