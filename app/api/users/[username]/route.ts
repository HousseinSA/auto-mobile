/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { findUserByEmailOrUsername, deleteUser } from "@/lib/mongodb/mongodb"

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split("/")[3] // Get username from path
    const user = await findUserByEmailOrUsername(username)
    if (!user) {
      return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split("/")[3] // Get username from path
    const result = await deleteUser(username)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    )
  }
}
