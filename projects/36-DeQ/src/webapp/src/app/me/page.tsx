import { Profile } from '@/components/Profile'

export const metadata = {
  title: 'DeQ - My Profile',
}

export default function UserDetailPage() {
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
      <Profile />
    </main>
  )
}
