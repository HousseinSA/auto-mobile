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
  showPassword: boolean
  email: string
  setPassword: (password: string) => void
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  login: (
    e: React.FormEvent
  ) => Promise<{ success: boolean; isAdmin: boolean; username: string }>
  register: (e: React.FormEvent) => Promise<void | boolean>
  setIsReady: (isReady: boolean) => void
  checkIsAdmin: () => boolean
  setUsername: (username: string) => void
  setFullName: (fullName: string) => void
  setPhoneNumber: (phoneNumber: string) => void
  togglePasswordVisibility: () => void
  setEmail: (email: string) => void
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
  showPassword: false,
  email: "",
  togglePasswordVisibility: () =>
    set((state) => ({ showPassword: !state.showPassword })),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setIsReady: (isReady) => set({ isReady }),

  setUsername: (username) => set({ username }),
  setFullName: (fullName) => set({ fullName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),

  login: async (e: React.FormEvent) => {
    e.preventDefault()
    set({ loading: true, error: "" })
  
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: get().username.toLowerCase(), // Changed from username to identifier
        password: get().password,
      })
  
      if (result?.error) {
        set({ error: result.error, loading: false })
        toastMessage("error", result.error)
        return { success: false, isAdmin: false, username: "" }
      }
  
      const isAdmin = get().username.toLowerCase() === "admin"
      set({ isAdmin, loading: false })
      toastMessage("success", "Connexion réussie!")
      return {
        success: true,
        isAdmin,
        username: get().username.toLowerCase(),
      }
    } catch (error) {
      set({ loading: false, error: "Une erreur est survenue" })
      toastMessage("error", "Une erreur est survenue")
      return { success: false, isAdmin: false, username: "" }
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
          email: get().email,
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
