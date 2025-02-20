"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClipLoader } from "react-spinners"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import toastMessage from "@/lib/ToastMessage"
import { getSession } from "next-auth/react"

export default function Login() {
  const router = useRouter()
  const {
    setIsReady,
    isReady,
    name,
    password,
    error,
    loading,
    setName,
    setPassword,
    login,
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
        router.push(path)
        toastMessage("Connexion réussie!", "success")
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-primary">
          Se connecter
        </h1>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <Input
              name="name"
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-primary rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <Input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-primary rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading && <ClipLoader size={20} color="white" className="mr-2" />}
            Se connecter
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Vous avez déjà un compte ?
          <a href="/register" className="text-primary hover:underline">
            {" "}
            S&apos;inscrire
          </a>
        </p>
      </div>
    </div>
  )
}
