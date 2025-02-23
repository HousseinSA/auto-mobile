import { create } from "zustand"
import { toast } from "react-hot-toast"
import { Service, ServiceRequest } from "@/types/ServiceTypes"

interface ServiceStore {
  services: Service[]
  loading: boolean
  error: string
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  addService: (serviceData: ServiceRequest) => Promise<boolean>
  fetchUserServices: (username: string) => Promise<void>
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: "",
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  addService: async (serviceData: ServiceRequest) => {
    set({ loading: true, error: "" })
    try {
      const response = await fetch("/api/services/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      if (data.service) {
        set((state) => ({
          services: [data.service, ...state.services],
        }))
      }

      set({ loading: false })
      toast.success("Service ajouté avec succès")
      return true
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'ajout du service",
        loading: false,
      })
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout du service"
      )
      return false
    }
  },
  fetchUserServices: async (username: string) => {
    set({ loading: true, error: "" })
    try {
      const response = await fetch(`/api/services/${username}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      set({ services: data.services })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Échec de la récupération des services"
      set({ error: message })
      toast.error(message)
    } finally {
      set({ loading: false })
    }
  },
}))
