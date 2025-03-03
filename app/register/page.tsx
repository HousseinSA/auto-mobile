"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import toastMessage from "@/lib/globals/ToastMessage"
import { useFormValidation } from "@/lib/utils/useFormValidation"
import { ValidationFields } from "@/lib/utils/validation"
import ServiceFeatures from "@/lib/globals/ServiceFeatures"

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
    showPassword,
    togglePasswordVisibility,
    setEmail,
  } = useAuthStore()

  const { errors, validateField, formatField } = useFormValidation()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await register(e)
    if (success) {
      toastMessage("success", "Inscription réussie!")
      router.push("/login")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as ValidationFields
    const { value } = e.target
    const formattedValue = formatField(name, value)

    if (validateField(name, formattedValue)) {
      switch (name) {
        case "username":
          setUsername(formattedValue)
          break
        case "fullName":
          setFullName(formattedValue)
          break
        case "email":
          setEmail(formattedValue)
          break
        case "phoneNumber":
          setPhoneNumber(formattedValue)
          break
        case "password":
          setPassword(formattedValue)
          break
      }
    }
  }

  useEffect(() => {
    setIsReady(true)
  }, [setIsReady])

  if (!isReady) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="w-full">
        <ServiceFeatures />
      </div>
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative z-0">
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
                name="username"
                type="text"
                placeholder="Identifiant de connexion"
                value={username}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            <div>
              <Input
                name="fullName"
                type="text"
                placeholder="Nom et prénom"
                value={fullName}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Input
                name="email"
                type="email"
                onChange={handleInputChange}
                required
                placeholder="Adresse email"
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              {/* <Input
                name="phoneNumber"
                type="tel"
                placeholder="Numéro de téléphone (8 chiffres)"
                value={phoneNumber}
                onChange={handleInputChange}
                required
                maxLength={20}
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              /> */}
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Numéro de téléphone "
                value={phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={handleInputChange}
                required
                minLength={5}
                maxLength={20}
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-12 text-sm sm:text-base text-white transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading && <Loader2 className="w-8 h-8 animate-spin mr-2" />}
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
    </div>
  )
}
