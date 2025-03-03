import { NextRequest } from "next/server"
import { createUser } from "@/lib/mongodb/mongodb"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate email format
    if (!isValidEmail(data.email)) {
      return Response.json(
        { success: false, message: "Format d'email invalide" },
        { status: 400 }
      )
    }

    const result = await createUser(data)

    if (!result.success) {
      return Response.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    return Response.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Register error:", error)
    return Response.json(
      { success: false, message: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
