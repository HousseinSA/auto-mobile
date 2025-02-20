"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import toastMessage from "@/lib/ToastMessage"
import { Loader2 } from "lucide-react"

const Register = () => {
  const router = useRouter()
  const {
    isReady,
    setIsReady,
    name,
    password,
    error,
    loading,
    setName,
    setPassword,
    register,
  } = useAuthStore()

  const handleRegister = async (e: React.FormEvent) => {
    const success = await register(e)
    if (success) {
      toastMessage("Inscription réussie!", "success")
      router.push("/")
    }
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
              name="name"
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            {loading && <Loader2 className="w-6 h-6 animate-spin " />}
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

export default Register
