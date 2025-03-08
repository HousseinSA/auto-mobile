import { NextResponse } from "next/server"
import { verifyPayment } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PUT(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 401 }
      )
    }


    await verifyPayment(params.serviceId, session.user.id)
    return NextResponse.json({ message: "Paiement vérifié avec succès" })
  } catch (error) {
    console.error("Verification error details:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la vérification",
      },
      { status: 500 }
    )
  }
}
