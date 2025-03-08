import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  type UserRole = "ADMIN" | "USER"

  interface User {
    id: string
    username: string
    email: string
    role: UserRole
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      username?: string
    } & DefaultSession["user"]
  }
}
