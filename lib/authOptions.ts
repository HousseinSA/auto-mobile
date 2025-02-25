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
          // Changed from username to identifier
          label: "Identifier",
          type: "text",
          placeholder: "Email ou identifiant",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          // Changed from username to identifier
          throw new Error("Identifiant et mot de passe requis")
        }

        try {
          const user = await verifyUserPassword(
            credentials.identifier, // Changed from username to identifier
            credentials.password
          )
          if (user) {
            return {
              id: user._id.toString(),
              name: user.username,
              username: user.username,
              email: user.email, // Add email to the returned user object
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
        // @ts-expect-error issue with id
        session.user.id = token.id as string
        session.user.name = token.name as string
        // @ts-expect-error issue with username
        session.user.username = token.name as string // Use token.name since it contains the username
        session.user.email = token.email as string // Add email to the session
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
