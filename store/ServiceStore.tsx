/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { useFormStore } from "./FormStore"
import { toast } from "react-hot-toast"
import {
  ServiceState,
  ServiceRequest,
  FuelType,
  ECUType,
  Generation,
  Service,
} from "@/lib/types/ServiceTypes"

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  loading: false,
  error: "",
  showForm: false,
  editingService: null,

  setShowForm: (show) => set({ showForm: show }),
  setEditingService: (service) =>
    set({ editingService: service, showForm: !!service }),

  fetchUserServices: async (username: string) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/services/${username}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      set({
        services: data.services || [],
        loading: false,
      })
    } catch (error) {
      set({ loading: false })
      toast.error("Échec de la récupération des services")
    }
  },

  addService: async (username: string) => {
    set({ loading: true })
    try {
      const form = useFormStore.getState()
      const formData = new FormData()

      const serviceData: ServiceRequest = {
        fuelType: form.fuelType as FuelType,
        ecuType: form.ecuType as ECUType,
        generation: form.generation as Generation,
        ecuNumber: form.getFullEcuNumber(),
        serviceOptions: form.serviceOptions,
        userName: username,
        status: "EN ATTENTE",
        totalPrice: form.calculateTotal(),
      }

      formData.append("serviceData", JSON.stringify(serviceData))

      if (form.stockFile) {
        formData.append("stockFile", form.stockFile)
      }

      const response = await fetch("/api/services/add", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Service add error:", data)
        throw new Error(data.error || "Erreur lors de l'ajout du service")
      }

      set((state) => ({
        services: [data.service, ...state.services],
        showForm: false,
        loading: false,
      }))

      toast.success("Service ajouté avec succès")
      return true
    } catch (error) {
      console.error("Service store error:", error)
      set({ loading: false })
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout du service"
      )
      return false
    }
  },
  updateService: async (serviceId: string, data: ServiceRequest) => {
    set({ loading: true })
    try {
      const form = useFormStore.getState()
      const formData = new FormData()

      const serviceData: Partial<Service> = {
        ...data,
        serviceOptions: Object.fromEntries(
          Object.entries(data.serviceOptions).map(([key, value]) => [
            key,
            {
              selected: value.selected,
              price: value.price,
              ...(value.selected && value.dtcDetails
                ? { dtcDetails: value.dtcDetails }
                : {}),
            },
          ])
        ),
        // @ts-expect-error null undefined issue
        stockFile: form.stockFile ? { name: form.stockFile.name } : null,
      }

      formData.append("serviceData", JSON.stringify(serviceData))

      if (form.stockFile) {
        formData.append("stockFile", form.stockFile)
      }

      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Update failed")
      }

      const responseData = await response.json()
      // @ts-expect-error fix
      set((state) => ({
        services: state.services.map((service) =>
          service._id === serviceId
            ? {
                ...service,
                ...serviceData,
                // Ensure clean update of service options
                serviceOptions: serviceData.serviceOptions || {},
                // Handle file removal properly
                stockFile: serviceData.stockFile,
              }
            : service
        ),
        editingService: null,
        showForm: false,
        loading: false,
      }))

      toast.success("Service mis à jour avec succès")
      return true
    } catch (error) {
      console.error("Update service error:", error)
      set({ loading: false })
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      )
      return false
    }
  },
  deleteService: async (serviceId: string) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      set((state) => ({
        services: state.services.filter((service) => service._id !== serviceId),
        loading: false,
      }))

      toast.success("Service supprimé avec succès")
      return true
    } catch (error) {
      set({ loading: false })
      toast.error("Erreur lors de la suppression")
      return false
    }
  },
}))
