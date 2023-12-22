import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/appRouter'
import { createFetchContext } from '@/server/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api',
    req,
    router: appRouter,
    createContext: createFetchContext,
  })

export { handler as GET, handler as POST }
