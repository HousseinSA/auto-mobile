/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { signIn } from "next-auth/react"
import toastMessage from "@/lib/ToastMessage"

interface LoginResponse {
    success: boolean
    isAdmin: boolean
}
interface AuthStore {
    name: string
    password: string
    error: string
    loading: boolean
    setName: (name: string) => void
    setPassword: (password: string) => void
    setError: (error: string) => void
    setLoading: (loading: boolean) => void
    login: (e: React.FormEvent) => Promise<LoginResponse>
    register: (e: React.FormEvent) => Promise<void | boolean>
    isReady: boolean
    setIsReady: (isReady: boolean) => void
    isAdmin: boolean
    checkIsAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    name: "",
    password: "",
    error: "",
    loading: false,
    isReady: false,
    isAdmin: false,
    setName: (name) => set({ name }),
    setPassword: (password) => set({ password }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),
    setIsReady: (isReady) => set({ isReady }),
    login: async (e: React.FormEvent) => {
        e.preventDefault()
        set({ loading: true })
        try {
            const result = await signIn("credentials", {
                redirect: false,
                name: get().name,
                password: get().password,
            })

            set({ loading: false })

            if (result?.error) {
                set({ error: result.error })
                return { success: false, isAdmin: false }
            }
            const isAdmin = get().name.toLowerCase() === "admin"
            set({ isAdmin })
            return { success: true, isAdmin }
        } catch (error) {
            set({ loading: false, error: "Une erreur est survenue" })
            toastMessage("Une erreur est survenue", "error")
            return { success: false, isAdmin: false }
        }
    },
    checkIsAdmin: () => get().name.toLowerCase() === "admin",
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
                    name: get().name,
                    password: get().password,
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
            return true
        }
    },
}))
