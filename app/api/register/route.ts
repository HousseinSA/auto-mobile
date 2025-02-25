import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/mongodb"

interface RegisterRequest {
  username: string
  password: string
  fullName: string
  phoneNumber: string
  email: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RegisterRequest

    // Basic validation
    if (
      !body.username ||
      !body.password ||
      !body.fullName ||
      !body.phoneNumber ||
      !body.email
    ) {
      return NextResponse.json(
        {
          error: "Tous les champs sont obligatoires.",
        },
        { status: 400 }
      )
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(body.username)) {
      return NextResponse.json(
        {
          error:
            "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, des chiffres, des tirets et des underscores.",
        },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          error: "Format d'email invalide.",
        },
        { status: 400 }
      )
    }

    const result = await createUser({
      username: body.username.toLowerCase(), // Convert to lowercase before saving
      password: body.password,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email.toLowerCase(), // Convert to lowercase before saving
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
