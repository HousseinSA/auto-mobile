import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/mongodb"

interface RegisterRequest {
  name: string
  password: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RegisterRequest

    if (!body.name || !body.password) {
      return NextResponse.json(
        {
          error: "Le nom d'utilisateur et le mot de passe sont obligatoires.",
        },
        { status: 400 }
      )
    }

    const result = await createUser({
      name: body.name,
      password: body.password,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: result.message,
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    )
  }
}
