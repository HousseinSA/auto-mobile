import { NextRequest, NextResponse } from "next/server"
import { getPayments } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const username = req.nextUrl.pathname.split("/")[4] // /api/payments/user/[username]
    if (!username) {
      return NextResponse.json(
        { error: "Nom d'utilisateur non fourni" },
        { status: 400 }
      )
    }

    if (
      session.user.role !== "ADMIN" && 
      session.user.name?.toLowerCase() !== username.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      )
    }

    const payments = await getPayments(username)
    return NextResponse.json({ payments })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des paiements" },
      { status: 500 }
    )
  }
}