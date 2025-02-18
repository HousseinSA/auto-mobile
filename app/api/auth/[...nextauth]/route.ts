import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyUserPassword } from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
        error: '/login',
        signOut: '/login'  
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "Name", type: "text", placeholder: "Enter your name" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.name || !credentials?.password) {
                    throw new Error("Name and password are required")
                }

                try {
                    const user = await verifyUserPassword(credentials.name, credentials.password)
                    if (user) {
                        return { id: user._id.toString(), name: user.name }
                    }
                    return null
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "Authentication failed")
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
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-expect-error id name
                session.user.id = token.id as string
                session.user.name = token.name as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }