import { NextResponse } from "next/server"
import { getPayments } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Only allow users to view their own payments unless they're admin
    if (
      session.user.role !== "ADMIN" && 
      session.user.name?.toLowerCase() !== params.username.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      )
    }

    const payments = await getPayments(params.username)
    return NextResponse.json({ payments })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des paiements" },
      { status: 500 }
    )
  }
}