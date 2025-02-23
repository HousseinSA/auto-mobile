/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { signIn } from "next-auth/react"
import toastMessage from "@/lib/ToastMessage"

interface LoginResponse {
  success: boolean
  isAdmin: boolean
}
interface AuthStore {
  username: string
  password: string
  fullName: string
  phoneNumber: string
  error: string
  loading: boolean
  isReady: boolean
  isAdmin: boolean
  setPassword: (password: string) => void
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  login: (e: React.FormEvent) => Promise<LoginResponse>
  register: (e: React.FormEvent) => Promise<void | boolean>
  setIsReady: (isReady: boolean) => void
  checkIsAdmin: () => boolean
  setUsername: (username: string) => void
  setFullName: (fullName: string) => void
  setPhoneNumber: (phoneNumber: string) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  username: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  error: "",
  loading: false,
  isReady: false,
  isAdmin: false,
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setIsReady: (isReady) => set({ isReady }),

  setUsername: (username) => set({ username }),
  setFullName: (fullName) => set({ fullName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

  login: async (e: React.FormEvent) => {
    e.preventDefault()
    set({ loading: true })
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: get().username, 
        password: get().password,
      })

      set({ loading: false })

      if (result?.error) {
        set({ error: result.error })
        return { success: false, isAdmin: false }
      }
      const isAdmin = get().username === "admin"
      set({ isAdmin })
      return { success: true, isAdmin }
    } catch (error) {
      set({ loading: false, error: "Une erreur est survenue" })
      toastMessage("Une erreur est survenue", "error")
      return { success: false, isAdmin: false }
    }
  },
  checkIsAdmin: () => get().username === "admin",
  register: async (e: React.FormEvent) => {
    e.preventDefault()
    set({ loading: true, error: "" })

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: get().username,
          password: get().password,
          fullName: get().fullName,
          phoneNumber: get().phoneNumber,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        set({ error: data.error, loading: false })
        return false
      }

      set({ loading: false })
      return true
    } catch (err) {
      set({
        loading: false,
        error: "Une erreur est survenue. Veuillez réessayer.",
      })
      return false
    }
  },
}))
