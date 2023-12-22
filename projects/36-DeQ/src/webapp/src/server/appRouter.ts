import { TRPCError } from '@trpc/server';
import { z } from 'zod'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { Prisma } from '@prisma/client'
import * as R from 'ramda'

import { publicProcedure, protectedProcedure, router } from './router'
import { createInternalContext } from './context'
import prisma from './db'

//
// Output Schemas
//

const registeredUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  handle: z.string(),
  avatar: z.string(),
  address: z.string(),
})

type RegisteredUser = z.infer<typeof registeredUserSchema>

const AnswerSchema = z.object({
  id: z.number(),
  body: z.string(),
  picked: z.boolean(),
  values: z.bigint(),
  shares: z.bigint(),
  pricePerShare: z.bigint(),
  createdAt: z.date(),
  user: registeredUserSchema,
  question_creator_id: z.number(),
})

const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  totalDeposit: z.bigint(),
  createdAt: z.date(),
  user: registeredUserSchema,
  answers: z.array(AnswerSchema.omit({ picked: true, question_creator_id: true })),
})


function transformRegisteredUser({ address, ...user }: Prisma.UserGetPayload<{}>): RegisteredUser {
  if (!address || !user.handle) {
    throw new Error('transformRegisteredUser failed: nullish user.address')
  }
  const name = user.name || + address.slice(0, 6) + '...' + address.slice(-4)
  const avatar = user.image || `https://effigy.im/a/${address}.png`
  return {
    id: user.id,
    name,
    handle: user.handle,
    avatar,
    address,
  }
}


//
// Routes
//

const listLatestQuestions = publicProcedure
  .input(z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    type: z.enum(['hot', 'unanswer']).nullish().default('hot'),
  }))
  .output(z.object({
    items: z.array(QuestionSchema)
  }))
  .query(async ({ input: { page, limit, type } }) => {
    let ids: number[] = []
    if (type === 'hot' || !type) {
      const filtered = await prisma.$queryRaw<{
        question_id: number,
        price_per_share: bigint,
        total_deposit: bigint,
        created_at: Date,
      }[]>(Prisma.sql`
        SELECT
          *
        FROM ( SELECT DISTINCT
            questions.id AS question_id,
            coalesce(max(answers.price_per_share), 0) AS price_per_share,
            questions.total_deposit,
            questions.created_at
          FROM
            public.questions
          LEFT JOIN public.answers ON questions.id = answers.question_id
        GROUP BY
          questions.id,
          answers.id
        HAVING
          count(answers.id) > 0
        ORDER BY
          question_id) AS t
        ORDER BY
          t.price_per_share DESC,
          t.total_deposit DESC,
          t.created_at DESC
        LIMIT ${limit}
        OFFSET ${(page - 1) * limit}
        ;
      `)
      ids = filtered.map((item) => item.question_id)
    } else if (type === 'unanswer') {
      const filtered = await prisma.$queryRaw<{
        question_id: number,
        total_deposit: bigint,
      }[]>(Prisma.sql`
        SELECT DISTINCT
            questions.id AS question_id,
            questions.total_deposit
          FROM
            public.questions
          LEFT JOIN public.answers ON questions.id = answers.question_id
        GROUP BY
          questions.id
        HAVING
          count(answers.id) = 0
        ORDER BY
          total_deposit desc
        LIMIT ${limit}
        OFFSET ${(page - 1) * limit}
        ;
      `)
      ids = filtered.map((item) => item.question_id)
    }
    const items = await prisma.question.findMany({
      where: {
        id: {
          'in': ids
        }
      },
      include: {
        user: true,
        answers: { include: { user: true }, take: 1, orderBy: { values: 'desc' } },
      },
    })
    const sorted = R.sort((i, j) => ids.indexOf(i.id) - ids.indexOf(j.id), items)
    return {
      items: sorted.map((question) => ({
        ...question,
        user: transformRegisteredUser(question.user),
        answers: question.answers.map((answer) => ({
          ...answer,
          user: transformRegisteredUser(answer.user),
        })),
      }))
    }
  })

const createQuestion = protectedProcedure
  .input(z.object({
    title: z.string(),
    body: z.string(),
    amount: z.bigint(),
  }))
  .output(QuestionSchema.omit({ answers: true }))
  .mutation(async ({ input: { title, body, amount }, ctx: { currentUser } }) => {
    const question = await prisma.question.create({
      data: {
        title,
        body,
        userId: currentUser.id,
        totalDeposit: amount,
      },
      include: {
        user: true,
      }
    })
    return {
      ...question,
      user: transformRegisteredUser(question.user),
    }
  })

const getQuestionById = publicProcedure
  .input(z.object({
    id: z.number(),
  }))
  .output(QuestionSchema.omit({ answers: true }))
  .query(async ({ input: { id } }) => {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
      }
    })
    if (!question) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Question not found' })
    }
    return {
      ...question,
      user: transformRegisteredUser(question.user),
    }
  })

const getUserCreatedQuestions = publicProcedure
  .input(z.object({
    userId: z.number(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .output(z.object({
    items: z.array(QuestionSchema)
  }))
  .query(async ({ input: { userId, page, limit } }) => {
    const items = await prisma.question.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        answers: { include: { user: true }, take: 10, orderBy: { createdAt: 'desc' } },
      },
    })
    return {
      items: items.map((question) => ({
        ...question,
        user: transformRegisteredUser(question.user),
        answers: question.answers.map((answer) => ({
          ...answer,
          user: transformRegisteredUser(answer.user),
        })),
      }))
    }
  })

const getUserAnsweredQuestions = publicProcedure
  .input(z.object({
    userId: z.number(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .output(z.object({
    items: z.array(QuestionSchema)
  }))
  .query(async ({ input: { userId, page, limit } }) => {
    const items = await prisma.question.findMany({
      where: {
        answers: {
          some: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        answers: { where: { userId }, include: { user: true } },
      },
    })
    return {
      items: items.map((question) => ({
        ...question,
        user: transformRegisteredUser(question.user),
        answers: question.answers.map((answer) => ({
          ...answer,
          user: transformRegisteredUser(answer.user),
          question_creator_id: question.userId,
        })),
      }))
    }
  })

const createAnswer = protectedProcedure
  .input(z.object({
    tokenId: z.number(),
    questionId: z.number(),
    body: z.string(),
  }))
  .mutation(async ({ input: { tokenId, questionId, body }, ctx: { currentUser } }) => {
    const answer = await prisma.answer.create({
      data: {
        body,
        tokenId,
        questionId,
        userId: currentUser.id,
      },
      include: {
        user: true,
      }
    })
    return answer
  })

const getAnswer = publicProcedure
  .input(z.object({
    id: z.number(),
  }))
  .query(async ({ input: { id } }) => {
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        user: true,
        question: true,
      },
    })
    if (!answer) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Answer not found' })
    }
    return {
      ...answer,
      user: transformRegisteredUser(answer.user),
    }
  })

const getAnswersByQuestionId = publicProcedure
  .input(z.object({
    id: z.number(),
    page: z.number().default(1),
    limit: z.number().default(100),
  }))
  .output(z.object({
    items: z.array(AnswerSchema)
  }))
  .query(async ({ input: { id, page, limit } }) => {
    const items = await prisma.answer.findMany({
      where: {
        questionId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        question: true,
      },
    })
    return {
      items: items.map((answer, idx) => ({
        ...answer,
        user: transformRegisteredUser(answer.user),
        question_creator_id: answer.question.userId,
      }))
    }
  })


const pickAnswer = protectedProcedure
  .input(z.object({
    id: z.number(),
    picked: z.boolean().default(false),
  }))
  .mutation(async ({ input: { id, picked }, ctx: { currentUser } }) => {
    await prisma.answer.update({
      where: { id },
      data: {
        picked
      }
    })
  })

const setUserHandleName = protectedProcedure
  .input(z.object({
    handle: z.string(),
    name: z.string(),
    check: z.boolean().default(false),
  }))
  .mutation(async ({ input: { handle, name, check }, ctx: { currentUser } }) => {
    const existHandleUser = await prisma.user.findUnique({ where: { handle } })
    if (existHandleUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Handle exists' })
    }
    if (!check) {
      const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          handle, name
        }
      })
      return user
    }
  })

const getUserInfo = publicProcedure
  .input(z.object({
    handle: z.string().optional(),
  }))
  .query(async ({ input: { handle }, ctx: { currentUser } }) => {
    if (!handle && !currentUser?.id) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
    let where: Prisma.UserWhereUniqueInput = { handle }
    if (!handle && currentUser?.id) {
      where = { id: currentUser.id }
    }
    const user = await prisma.user.findUnique({ where })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    const unclaimedStaking = BigInt(0)
    return { user, unclaimedStaking }
  })

const getAnswerTradeHistory = publicProcedure
  .input(z.object({
    tokenId: z.number(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .query(async ({ input: { tokenId, page, limit } }) => {
    const items = await prisma.tradeLog.findMany({
      where: {
        tokenId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      items: items.map((log) => ({
        ...log,
        user: log.user ? transformRegisteredUser(log.user) : null,
      }))
    }
  })

const getAnswerHolders = publicProcedure
  .input(z.object({
    tokenId: z.number(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .output(z.object({
    items: z.array(z.object({
      id: z.number(),
      user: registeredUserSchema,
      shares: z.bigint(),
    }))
  }))
  .query(async ({ input: { tokenId, page, limit } }) => {
    const items = await prisma.holder.findMany({
      where: {
        tokenId,
      },
      orderBy: {
        shares: 'desc',
      },
      include: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      items: items.map((holder) => ({
        ...holder,
        user: transformRegisteredUser(holder.user),
      }))
    }
  })


const getUserHoldings = publicProcedure
  .input(z.object({
    userId: z.number(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .output(z.object({
    items: z.array(z.object({
      id: z.number(),
      user: registeredUserSchema,
      shares: z.bigint(),
      answer: z.object({
        id: z.number(),
        body: z.string()
      }),
    }))
  }))
  .query(async ({ input: { userId, page, limit } }) => {
    const items = await prisma.holder.findMany({
      where: {
        userId,
      },
      orderBy: {
        shares: 'desc',
      },
      include: {
        user: true,
        answer: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      items: items.map((holder) => ({
        ...holder,
        user: transformRegisteredUser(holder.user),
        answer: {
          id: holder.answer.id,
          body: holder.answer.body,
        }
      }))
    }
  })
//
// Final
//

export const appRouter = router({
  questions: router({
    lastest: listLatestQuestions,
    create: createQuestion,
    getById: getQuestionById,
    getUserCreated: getUserCreatedQuestions,
    getUserAnswered: getUserAnsweredQuestions,
  }),
  answers: router({
    create: createAnswer,
    getById: getAnswer,
    tradeHistory: getAnswerTradeHistory,
    holders: getAnswerHolders,
    getByQuestionId: getAnswersByQuestionId,
    pick: pickAnswer,
  }),
  users: router({
    info: getUserInfo,
    setHandleName: setUserHandleName,
    holdings: getUserHoldings
    // TODO checker
  }),
})

export type AppRouter = typeof appRouter

export async function useTrpcPreload() {
  const ctx = await createInternalContext()
  return createServerSideHelpers({
    router: appRouter,
    ctx,
  })
}
