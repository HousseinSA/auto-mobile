/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import toastMessage from "@/lib/globals/ToastMessage"

interface AdminStore {
  services: Service[]
  loading: boolean
  error: string
  searchTerm: string
  setSearchTerm: (term: string) => void
  fetchAllServices: () => Promise<void>
  updateServiceStatus: (serviceId: string, status: string) => Promise<void>
  statusUpdateLoading: boolean
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

  updateServiceStatus: async (serviceId: string, status: string) => {
    set({ statusUpdateLoading: true })
    try {
      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      // Update local state
      set((state) => ({
        services: state.services.map((service) =>
          service._id === serviceId
            ? { ...service, status: status as ServiceStatus }
            : service
        ),
        statusUpdateLoading: false,
      }))

      toastMessage("success", "Status updated successfully")
    } catch (error) {
      toastMessage("error", "Failed to update status")
    }
  },
}))
