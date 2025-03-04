/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { FileData, Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import toastMessage from "@/lib/globals/ToastMessage"

interface AdminStore {
  services: Service[]
  loading: boolean
  error: string
  searchTerm: string
  statusUpdateLoading: boolean
  filterStatus: string
  fileUploadLoading: { [key: string]: boolean }
  setSearchTerm: (term: string) => void
  fetchAllServices: () => Promise<void>
  updateServiceStatus: (
    serviceId: string,
    status: ServiceStatus
  ) => Promise<void>
  setFilterStatus: (status: string) => void
  uploadModifiedFile: (serviceId: string, file: File) => Promise<void>
  downloadFile: (fileData: FileData, isModified?: boolean) => void
  removeModifiedFile: (serviceId: string) => Promise<void>
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  services: [],
  loading: false,
  statusUpdateLoading: false,
  error: "",
  searchTerm: "",
  filterStatus: "active",
  fileUploadLoading: {},
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterStatus: (status) => set({ filterStatus: status }),
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

  uploadModifiedFile: async (serviceId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toastMessage("error", "La taille du fichier doit être inférieure à 5MB")
      return
    }

    set((state) => ({
      fileUploadLoading: { ...state.fileUploadLoading, [serviceId]: true },
    }))

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(
        `/api/services/uploadModified/${serviceId}`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      await get().fetchAllServices()
      toastMessage("success", "Fichier téléversé avec succès")
    } catch (error) {
      console.error("Upload error:", error)
      toastMessage("error", "Échec du téléversement du fichier")
    } finally {
      set((state) => ({
        fileUploadLoading: { ...state.fileUploadLoading, [serviceId]: false },
      }))
    }
  },

  removeModifiedFile: async (serviceId: string) => {
    set((state) => ({
      fileUploadLoading: { ...state.fileUploadLoading, [serviceId]: true },
    }))

    try {
      const response = await fetch(
        `/api/services/removeModified/${serviceId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Remove failed")
      }

      await get().fetchAllServices()
      toastMessage("success", "Fichier supprimé avec succès")
    } catch (error) {
      console.error("Remove error:", error)
      toastMessage("error", "Échec de la suppression du fichier")
    } finally {
      set((state) => ({
        fileUploadLoading: { ...state.fileUploadLoading, [serviceId]: false },
      }))
    }
  },

  downloadFile: (fileData: FileData, isModified = false) => {
    try {
      const binaryData = atob(fileData.data as string)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: "application/octet-stream" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = fileData.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toastMessage(
        "error",
        `Échec du téléchargement du fichier ${isModified ? "modifié" : ""}`
      )
    }
  },
}))
