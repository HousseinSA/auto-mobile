import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/mongodb"

interface RegisterRequest {
  username: string
  password: string
  fullName: string
  phoneNumber: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RegisterRequest

    if (
      !body.username ||
      !body.password ||
      !body.fullName ||
      !body.phoneNumber
    ) {
      return NextResponse.json(
        {
          error: "Tous les champs sont obligatoires.",
        },
        { status: 400 }
      )
    }

    const result = await createUser({
      username: body.username,
      password: body.password,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
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
