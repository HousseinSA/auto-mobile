import { NextRequest, NextResponse } from "next/server"
import { updateServiceStatus } from "@/lib/mongodb/services/serviceModification"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Get serviceId from URL path
    const serviceId = req.nextUrl.pathname.split("/")[4]
    if (!serviceId) {
      return NextResponse.json(
        { error: "ID de service non fourni" },
        { status: 400 }
      )
    }

    const { status } = await req.json()

    await updateServiceStatus(serviceId, status)
    return NextResponse.json({ 
      message: "Statut du service mis à jour avec succès" 
    })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
}