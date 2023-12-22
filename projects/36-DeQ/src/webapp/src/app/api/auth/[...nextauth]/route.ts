
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
// import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import prisma from '@/server/db'

import { custom } from 'openid-client';
import type { AuthOptions } from "next-auth"

custom.setHttpOptionsDefaults({
  timeout: 5000,
});

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET
    // })

    CredentialsProvider({
      name: 'metamask',
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: (credentials as any).csrfToken,
          })

          if (result.success) {
            const existingUser = await prisma.user.findUnique({
              where: {
                address: siwe.address
              }
            });

            if (!existingUser) {
              // TODO should we create Account object?
              const newUser = await prisma.user.create({
                data: {
                  name: siwe.address,
                  address: siwe.address,
                  image: 'https://effigy.im/',
                }
              });
              return newUser
            }
            return existingUser
          }
          return null
        } catch (e) {
          console.error(e)
          return null
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/',
  },
  session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token }) {
      // console.log('inJWT', token)
      const currentUser = await prisma.user.findUnique({ where: { id: Number(token.sub) } })
      if (currentUser?.handle) {
        token.handle = currentUser.handle
      }
      return token
    },
    async session({ session, token }) {
      // console.log('inSession', session, token)
      if (session.user) {
        // extend session info
        session.user.handle = token?.handle
        session.user.id = Number(token.sub)
      }
      // console.log('nextauthsession: ', session)
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }