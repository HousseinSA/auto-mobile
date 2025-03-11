import type { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserPassword } from "@/lib/mongodb/users/authQueries";

interface CustomUser extends User {
  username: string;
}

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
          throw new Error("Identifiant et mot de passe requis");
        }

        try {
          const user = await verifyUserPassword(
            credentials.identifier,
            credentials.password
          );
          if (user) {
            return {
              id: user._id.toString(),
              name: user.username,
              username: user.username,
              email: user.email,
              role: user.role || "USER",
            } as CustomUser;
          }
          return null;
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? error.message
              : "Échec de l'authentification"
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name?.toLowerCase();
        token.email = user.email;
        // Add role from user
        token.role = ((user as User).role as "ADMIN") || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        // Add role to session
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
