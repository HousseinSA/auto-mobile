import { NextResponse } from "next/server"
import { getPayments } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payments = await getPayments()
    return NextResponse.json({ payments }) // Wrap payments in an object
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement des paiements" },
      { status: 500 }
    )
  }
}
