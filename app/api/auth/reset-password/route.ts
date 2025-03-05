import { connectDB } from "@/lib/mongodb/connection"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    const database = await connectDB()
    const user = await database.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      )
    }

    await database.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: newPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      }
    )

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Échec de la réinitialisation du mot de passe" },
      { status: 500 }
    )
  }
}
