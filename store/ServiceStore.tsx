import { create } from "zustand"
import { toast } from "react-hot-toast"
import { Service, ServiceRequest } from "@/types/ServiceTypes"

interface ServiceStore {
  services: Service[]
  loading: boolean
  error: string
  showForm: boolean
  editingService: Service | null
  setShowForm: (show: boolean) => void
  setEditingService: (service: Service | null) => void
  fetchUserServices: (username: string) => Promise<void>
  deleteService: (serviceId: string) => Promise<boolean>
  updateService: (serviceId: string, data: ServiceRequest) => Promise<boolean>
  addService: (serviceData: ServiceRequest) => Promise<boolean>
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: "",
  showForm: false,
  editingService: null,

  setShowForm: (show) => set({ showForm: show }),
  setEditingService: (service) => {
    set({
      editingService: service,
      showForm: !!service,
    })
  },

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
  deleteService: async (serviceId: string) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.message)

      set((state) => ({
        services: state.services.filter((service) => service._id !== serviceId),
      }))

      toast.success("Service supprimé avec succès")
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      toast.error(message)
      return false
    } finally {
      set({ loading: false })
    }
  },

  updateService: async (serviceId: string, data: Partial<ServiceRequest>) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString() // Add update timestamp
        }),
      })

      const responseData = await response.json()
      if (!responseData.success) throw new Error(responseData.message)

      // Update local state with new data including timestamp
      set((state) => ({
        services: state.services.map((service) =>
          service._id === serviceId
            ? {
                ...service,
                ...data,
                updatedAt: new Date().toISOString()
              }
            : service
        ),
        editingService: null,
        showForm: false
      }))

      toast.success("Service mis à jour avec succès")
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      toast.error(message)
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
