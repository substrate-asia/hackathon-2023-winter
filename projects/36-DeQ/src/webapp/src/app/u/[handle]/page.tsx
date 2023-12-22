import { UserHoldings } from '@/components/UserHoldings'

interface PageParams {
  handle: string
}

export const metadata = {
  title: 'DeQ - User',
}

export default function UserDetailPage({ params }: { params: PageParams }) { 
  const handle = params.handle
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
      @{handle}
      <div>
        <UserHoldings handle={handle} />
      </div>
    </main>
  )
}
