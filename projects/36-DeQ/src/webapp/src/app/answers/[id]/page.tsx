import { AnswerView, AnswerData } from '@/components/AnswerView'

interface PageParams {
  id: string
}

export const metadata = {
  title: 'DeQ - Answer',
}

export default function AnswerDetailPage({ params }: { params: PageParams }) { 
  const answerId = Number(params.id)
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
      <AnswerView id={answerId} />
      <AnswerData id={answerId} />
    </main>
  )
}
