"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageBackground from "@/lib/globals/PageBackground"
import toastMessage from "@/lib/globals/ToastMessage"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

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
        throw new Error(data.error || "Une erreur est survenue")
      }

      setEmailSent(true)
      toastMessage("success", data.message)
    } catch (error) {
      toastMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <PageBackground />
      <div className="relative z-10 w-full max-w-md p-8 glass-panel bg-white/90 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Réinitialisation du mot de passe
        </h1>

        {emailSent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Un email a été envoyé avec les instructions de réinitialisation.
            </p>
            <a href="/login" className="text-primary hover:underline">
              Retour à la connexion
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Envoyer le lien de réinitialisation
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
