'use client';

import { type ReactNode } from 'react'
import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@/server/appRouter'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'


export const trpcQuery = createTRPCReact<AppRouter>()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 30 seconds
    },
  },
})

export const trpcQueryClient = trpcQuery.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/api',
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        }
      },
    }),
  ],
})

export function TrpcContextProvider({ children }: { children: ReactNode }) {
  return (
    <trpcQuery.Provider client={trpcQueryClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpcQuery.Provider>
  )
}

export function RehydrateHandler({ data, children }: { data: any; children: ReactNode }) {
  const state = trpcQuery.useDehydratedState(trpcQueryClient, data)
  return <Hydrate state={state}>{children}</Hydrate>
}
