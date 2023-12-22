import { AnswerForm } from '@/components/AnswerForm'
import { QuestionView } from '@/components/QuestionView'
import { AnswerList } from '@/components/AnswerList'

interface PageParams {
  id: string
}

export const metadata = {
  title: 'DeQ - Question',
}

export default function UserDetailPage({ params }: { params: PageParams }) { 
  const id = Number(params.id)
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8 pb-8">
      <QuestionView id={id} />
      <AnswerList id={id} />
      <AnswerForm questionId={id} />
    </main>
  )
}
