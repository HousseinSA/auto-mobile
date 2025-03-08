import { NextRequest, NextResponse } from "next/server"
import { verifyPayment, rejectPayment } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const paymentId = req.nextUrl.pathname.split("/")[4]
    if (!paymentId) {
      return NextResponse.json(
        { error: "ID de paiement non fourni" },
        { status: 400 }
      )
    }

    const { status } = await req.json()

    if (status === "VERIFIED") {
      await verifyPayment(paymentId, session.user.id)
      return NextResponse.json({ message: "Paiement vérifié avec succès" })
    } else if (status === "FAILED") {
      await rejectPayment(paymentId, session.user.id)
      return NextResponse.json({ message: "Paiement rejeté avec succès" })
    }

    return NextResponse.json(
      { error: "Status invalide" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
}