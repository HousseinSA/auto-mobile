"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toastMessage from "@/lib/globals/ToastMessage"
import { useFormValidation } from "@/lib/utils/useFormValidation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { errors, validateField } = useFormValidation()

  const validateConfirmPassword = (pass: string, confirmPass: string) => {
    if (pass !== confirmPass) {
      return "Les mots de passe ne correspondent pas"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toastMessage("error", "Token de réinitialisation manquant")
      return
    }

    const confirmError = validateConfirmPassword(password, confirmPassword)
    if (confirmError) {
      toastMessage("error", confirmError)
      return
    }

    if (!validateField("password", password)) {
      toastMessage("error", errors.password || "Mot de passe invalide")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toastMessage("success", "Mot de passe réinitialisé avec succès")
      router.push("/login")
    } catch (error) {
      toastMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validateField("password", value)
  }

  if (!token) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-red-500">Lien de réinitialisation invalide</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-primary text-center mb-6">
        Nouveau mot de passe
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Nouveau mot de passe"
            required
            minLength={5}
            maxLength={20}
            className="w-full"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            required
            minLength={5}
            maxLength={20}
            className="w-full"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Button type="submit" className="w-full text-white" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Réinitialiser le mot de passe
        </Button>
      </form>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
