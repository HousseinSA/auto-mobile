import { findUserByEmailOrUsername } from "@/lib/mongodb/users/userQueries"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { randomBytes } from "crypto"
import { connectDB } from "@/lib/mongodb/connection"

const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const RESET_TOKEN_EXPIRES = 3600000 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const user = await findUserByEmailOrUsername(email)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Aucun compte trouvé avec cet email",
        },
        { status: 404 }
      )
    }

    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRES)

    const database = await connectDB()
    await database.collection("users").updateOne(
      { email: user.email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    )

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    try {
      await transporter.verify()
    } catch (error) {
      console.error("Email configuration error:", error)
      return NextResponse.json(
        { error: "Email service configuration error" },
        { status: 500 }
      )
    }

    try {
      await transporter.sendMail({
        from: `"ToyotaECUSERVICES" <${EMAIL_FROM}>`,
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 10px 20px; 
                      background-color: #007bff; color: white; 
                      text-decoration: none; border-radius: 5px; 
                      margin: 15px 0;">
              Réinitialiser le mot de passe
            </a>
            <p>Ce lien expirera dans 1 heure.</p>
            <p style="color: #666; font-size: 14px;">
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        `,
      })
    } catch (error) {
      console.error("Email sending error:", error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email de réinitialisation envoyé avec succès",
    })
  } catch (error) {
    console.error("Request error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}
