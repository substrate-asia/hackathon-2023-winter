import { QuestionCreateForm } from '@/components/QuestionCreateForm'

export default async function QuestionCreatePage() {
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
      <div className="mx-auto">
        <QuestionCreateForm />
      </div>
    </main>
  )
}
