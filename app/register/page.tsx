"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import toastMessage from "@/lib/ToastMessage"
import { Loader2 } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const {
    isReady,
    setIsReady,
    username,
    password,
    fullName,
    phoneNumber,
    error,
    loading,
    setUsername,
    setPassword,
    setFullName,
    setPhoneNumber,
    register,
  } = useAuthStore()

  const handleRegister = async (e: React.FormEvent) => {
    const success = await register(e)
    if (success) {
      toastMessage("success", "Inscription réussie!")
      router.push("/")
    }
  }

  const validatePhoneNumber = (value: string) => {
    // Allow only numbers starting with 4, 2, or 3
    const pattern = /^[423][0-9]*$/
    if (!pattern.test(value)) return false
    return value.length <= 8
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (value === "" || validatePhoneNumber(value)) {
      setPhoneNumber(value)
    }
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow letters with spaces between words
    if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
      // Prevent multiple consecutive spaces
      const trimmedValue = value.replace(/\s+/g, " ")
      setFullName(trimmedValue)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "") //
    setUsername(value)
  }

  useEffect(() => {
    setIsReady(true)
  }, [setIsReady])

  if (!isReady) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary mb-4 sm:mb-6">
          Créer un compte
        </h1>

        {error && (
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-red-500 text-center">
            {error}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
        >
          <div>
            <Input
              name="fullName"
              type="text"
              placeholder="Nom et prénom"
              value={fullName}
              onChange={handleFullNameChange}
              required
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <Input
              name="username"
              type="text"
              placeholder="Identifiant de connexion (sans espaces)"
              value={username}
              onChange={handleUsernameChange}
              required
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Numéro de téléphone (8 chiffres)"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
              maxLength={8}
              pattern="^[423][0-9]{7}$"
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-12 text-sm sm:text-base text-white transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading && <Loader2 className="w-6 h-6 animate-spin mr-2" />}
            S&apos;inscrire
          </Button>
        </form>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-center text-gray-700">
          Vous avez déjà un compte?{" "}
          <a href="/login" className="text-primary hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
