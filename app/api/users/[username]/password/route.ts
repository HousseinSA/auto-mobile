import { NextRequest, NextResponse } from "next/server"
import { updateUserPassword } from "@/lib/mongodb"

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const body = await request.json()
    const result = await updateUserPassword(params.username, body)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du mot de passe" },
      { status: 500 }
    )
  }
}