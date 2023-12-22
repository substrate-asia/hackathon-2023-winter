import { type inferAsyncReturnType } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function createFetchContext(opts: FetchCreateContextFnOptions) {
  // TODO: session restore, etc. Take care that's happen on client-side.
  const { req } = opts
  const session = await getServerSession(authOptions)
  return { req, session }
}

export async function createInternalContext() {
  return {} as Context
}

type FetchContext = inferAsyncReturnType<typeof createFetchContext>

export interface Context {
  req?: FetchContext['req']
  currentUser?: {
    id: number
    name?: string
    handle?: string
    address: `0x${string}`
  },
  session: Session | null
}
