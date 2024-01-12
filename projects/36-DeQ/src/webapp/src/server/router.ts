import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { Decimal } from 'decimal.js'

import { type Context } from './context'
import prisma from './db'

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: v => v.toJSON(),
    deserialize: v => new Decimal(v),
  },
  'decimal.js'
)


//
// Create the tRPC instance.
//
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

//
// Predefined procedures, includes:
// - publicProcedure: no authentication required
//
export const publicProcedure = t.procedure

//
// authentication middleware.
//
type AuthedContext = Omit<Context, 'currentUser'> & Required<Pick<Context, 'currentUser'>>


type MiddlewareArgs = Parameters<Parameters<typeof t.middleware>[0]>[0]


async function auth_middleware({ ctx, next }: MiddlewareArgs) {
  let currentUser
  if (!ctx?.session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  currentUser = await prisma.user.findUnique({ where: { id: ctx.session.user.id } })
  return next({
    ctx: { ...ctx, currentUser } as AuthedContext,
  })
}


export const protectedProcedure = t.procedure.use(t.middleware(auth_middleware))

export const router = t.router
