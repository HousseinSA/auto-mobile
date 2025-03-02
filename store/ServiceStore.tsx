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
} from "@/lib/types/ServiceTypes"
import { Binary } from "mongodb"

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
      console.log(form.stockFile)

      const serviceData: ServiceRequest = {
        fuelType: form.fuelType as FuelType,
        ecuType: form.ecuType as ECUType,
        generation: form.generation as Generation,
        ecuNumber: form.getFullEcuNumber(),
        serviceOptions: form.serviceOptions,
        userName: username,
        status: "EN ATTENTE",
        totalPrice: form.calculateTotal(),
        stockFile: form.stockFile ? form.stockFile.name : undefined,
      }

      const response = await fetch("/api/services/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      set((state) => ({
        services: [data.service, ...state.services],
        showForm: false,
        loading: false,
      }))

      toast.success("Service ajouté avec succès")
      return true
    } catch (error) {
      set({ loading: false })
      toast.error("Erreur lors de l'ajout du service")
      console.error("Add service error:", error)
      return false
    }
  },
  updateService: async (serviceId: string, data: ServiceRequest) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/services/service/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.error)

      set((state) => ({
        services: state.services.map((service) =>
          service._id.toString() === serviceId
            ? { ...service, ...data }
            : service
        ),
        editingService: null,
        showForm: false,
        loading: false,
      }))

      toast.success("Service mis à jour avec succès")
      return true
    } catch (error) {
      set({ loading: false })
      toast.error("Erreur lors de la mise à jour")
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
        services: state.services.filter(
          (service) => service._id.toString() !== serviceId
        ),
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
