/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { signIn } from "next-auth/react"
import toastMessage from "@/lib/globals/ToastMessage"

interface AuthStore {
  username: string
  password: string
  fullName: string
  phoneNumber: string
  error: string
  loading: boolean
  isReady: boolean
  showPassword: boolean
  email: string
  setPassword: (password: string) => void
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  login: (e: React.FormEvent) => Promise<{ success: boolean; username: string }>
  register: (e: React.FormEvent) => Promise<void | boolean>
  setIsReady: (isReady: boolean) => void
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
        identifier: get().username.toLowerCase(),
        password: get().password,
      })

      if (result?.error) {
        set({ error: result.error, loading: false })
        toastMessage("error", result.error)
        return { success: false, username: "" }
      }

      set({ loading: false })
      toastMessage("success", "Connexion réussie!")
      return {
        success: true,
        username: get().username.toLowerCase(),
      }
    } catch (error) {
      set({ loading: false, error: "Une erreur est survenue" })
      toastMessage("error", "Une erreur est survenue")
      return { success: false, username: "" }
    }
  },
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
        set({ error: data.message, loading: false }) // Changed from data.error to data.message
        toastMessage("error", data.message) // Add toast message for error
        return false
      }

      set({ loading: false })
      return true
    } catch (err) {
      const errorMessage = "Une erreur est survenue. Veuillez réessayer."
      set({
        loading: false,
        error: errorMessage,
      })
      toastMessage("error", errorMessage)
      return false
    }
  },
}))
