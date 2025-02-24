import { NextRequest } from "next/server"
import { updateUserPassword } from "@/lib/mongodb"

export async function PUT(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split("/")[3] // Get username from path
    const body = await request.json()
    const result = await updateUserPassword(username, body)

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 400 })
    }

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error("Password update error:", error)
    return Response.json(
      { error: "Erreur lors de la mise à jour du mot de passe" },
      { status: 500 }
    )
  }
}
