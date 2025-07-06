import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }
        
        try {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email } 
          })
          
          console.log("User found:", !!user)
          
          if (!user || !user.password) {
            console.log("User not found or no password")
            return null
          }
          
          const isValid = await compare(credentials.password, user.password)
          console.log("Password valid:", isValid)
          
          if (!isValid) {
            return null
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            image: user.image || null,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  debug: true,
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 