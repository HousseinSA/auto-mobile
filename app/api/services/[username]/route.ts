import { NextRequest } from "next/server"
import { getUserServices } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split("/").pop()

    if (!username) {
      return Response.json(
        { error: "Nom d'utilisateur requis" },
        { status: 400 }
      )
    }

    const services = await getUserServices(username)

    return Response.json({
      success: true,
      services,
    })
  } catch (error) {
    console.error("Fetch services error:", error)
    return Response.json(
      { error: "Échec de la récupération des services" },
      { status: 500 }
    )
  }
}
