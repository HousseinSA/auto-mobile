"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import { getSession } from "next-auth/react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const {
    setIsReady,
    isReady,
    username,
    password,
    error,
    loading,
    setUsername,
    setPassword,
    login,
    showPassword,
    togglePasswordVisibility,
  } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    const result = await login(e)
    if (result.success) {
      const session = await getSession()
      if (session?.user?.name) {
        router.refresh()
        const path = result.isAdmin
          ? "/dashboard"
          : `/dashboard/${session.user.name.toLowerCase()}`
        window.location.href = path
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-center font-bold text-primary mb-6">
          Se connecter
        </h1>

        {error && (
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-red-500 text-center">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
        >
          <div>
            <Input
              name="username"
              type="text"
              placeholder="Identifiant de connexion"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
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
            {loading && <Loader2 className="w-8 h-8 animate-spin" />}
            Se connecter
          </Button>
        </form>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-center text-gray-700">
          Vous avez déjà un compte ?
          <a href="/register" className="text-primary hover:underline ml-1">
            S&apos;inscrire
          </a>
        </p>
      </div>
    </div>
  )
}
