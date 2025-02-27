import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyUserPassword } from "@/lib/mongodb"

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Identifier",
          type: "text",
          placeholder: "Email ou identifiant",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifiant et mot de passe requis")
        }

        try {
          const user = await verifyUserPassword(
            credentials.identifier,
            credentials.password
          )
          if (user) {
            return {
              id: user._id.toString(),
              name: user.username,
              username: user.username,
              email: user.email,
            }
          }
          return null
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? error.message
              : "Échec de l'authentification"
          )
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name?.toLowerCase()
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error name username
        session.user.id = token.id as string
        session.user.name = token.name as string
        // @ts-expect-error name username
        session.user.username = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
