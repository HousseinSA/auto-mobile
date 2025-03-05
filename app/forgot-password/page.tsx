/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import toastMessage from "@/lib/globals/ToastMessage"
export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite")
      }

      toastMessage(
        "success",
        "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation"
      )
      setEmail("")
    } catch (error) {
      toastMessage(
        "error",
        "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Réinitialiser le mot de passe
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre adresse email"
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Envoyer le lien de réinitialisation
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-primary hover:underline">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  )
}
