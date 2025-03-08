/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { updateServiceStatus } from "@/lib/mongodb/services/serviceModification"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"

export async function PUT(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { status } = await request.json()

    // Prevent direct "TERMINÉ" status update
    if (status === "TERMINÉ") {
      return NextResponse.json(
        { 
          error: "Le statut 'TERMINÉ' est automatiquement défini lors de la vérification du paiement" 
        },
        { status: 400 }
      )
    }

    await updateServiceStatus(params.serviceId, status)
    return NextResponse.json({ message: "Statut mis à jour avec succès" })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    )
  }
}