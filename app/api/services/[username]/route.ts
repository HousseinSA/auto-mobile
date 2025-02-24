import { NextRequest, NextResponse } from "next/server"
import { getUserServices } from "@/lib/mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = await params.username

    if (!username) {
      return NextResponse.json(
        { error: "Nom d'utilisateur requis" },
        { status: 400 }
      )
    }

    const services = await getUserServices(username)

    return NextResponse.json({
      success: true,
      services,
    })
  } catch (error) {
    console.error("Fetch services error:", error)
    return NextResponse.json(
      { error: "Échec de la récupération des services" },
      { status: 500 }
    )
  }
}
