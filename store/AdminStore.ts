/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import toastMessage from "@/lib/globals/ToastMessage"

interface AdminStore {
  services: Service[]
  loading: boolean
  error: string
  searchTerm: string
  statusUpdateLoading: boolean
  setSearchTerm: (term: string) => void
  fetchAllServices: () => Promise<void>
  updateServiceStatus: (
    serviceId: string,
    status: ServiceStatus
  ) => Promise<void>
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  services: [],
  loading: false,
  statusUpdateLoading: false,
  error: "",
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  fetchAllServices: async () => {
    set({ loading: true })
    try {
      const response = await fetch("/api/services/allServices")
      const data = await response.json()
      if (response.ok) {
        set({ services: data.services })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      set({ error: "Failed to fetch services" })
      toastMessage("error", "Failed to fetch services")
    } finally {
      set({ loading: false })
    }
  },

  updateServiceStatus: async (serviceId: string, status: ServiceStatus) => {
    set({ statusUpdateLoading: true })
    try {
      const response = await fetch(`/api/services/status/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update status")

      set((state) => ({
        services: state.services.map((service) =>
          service._id === serviceId ? { ...service, status } : service
        ),
      }))

      toastMessage("success", "Status mis à jour avec succès")
    } catch (error) {
      console.error("Status update error:", error)
      toastMessage("error", "Échec de la mise à jour du status")
    } finally {
      set({ statusUpdateLoading: false })
    }
  },
}))
