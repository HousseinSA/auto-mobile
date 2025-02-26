"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useServiceStore } from "@/store/ServiceStore"
import { useFormStore } from "@/store/FormStore"
import {
  ECUType,
  FuelType,
  Generation,
  Service,
  ServiceRequest,
} from "@/lib/types/ServiceTypes"
import { DashboardHeader } from "./components/DashboardHeader"
import { ToyotaLogo } from "./components/ToyotaLogo"
import { ServiceForm } from "./components/ServiceForm"
import { ServicesList } from "./components/ServicesList"

interface UserDashboardProps {
  username: string
}

export default function UserDashboard({ username }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    services,
    showForm,
    editingService,
    setShowForm,
    setEditingService,
    fetchUserServices,
    deleteService,
    updateService,
    addService,
    loading,
  } = useServiceStore()

  const form = useFormStore()

  // Handle authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (
      status === "authenticated" &&
      session?.user?.name?.toLowerCase() !== username.toLowerCase()
    ) {
      // router.push(`/dashboard/${session.user.name.toLowerCase()}`)
    }
  }, [status, session?.user?.name, username, router])

  // Handle data fetching separately
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name?.toLowerCase() === username.toLowerCase()
    ) {
      fetchUserServices(username)
    }
  }, [status, session?.user?.name, username, fetchUserServices])

  // Handle form population
  const { populateForm } = form
  useEffect(() => {
    if (editingService && showForm) {
      populateForm(editingService)
    }
  }, [editingService, showForm, populateForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if at least one option is selected

    const selectedOptions = Object.entries(form.serviceOptions)
      .filter(([, opt]) => opt.selected)
      .map(([key, opt]) => ({
        optionId: key,
        price: opt.price,
      }))

    if (selectedOptions.length === 0) {
      // toast.error("Veuillez sélectionner au moins une option")
      return
    }
    setIsSubmitting(true)

    try {
      const serviceData: ServiceRequest = {
        fuelType: form.fuelType as FuelType,
        ecuType: form.ecuType as ECUType,
        generation: form.generation as Generation,
        ecuNumber: form.getFullEcuNumber(),
        serviceOptions: form.serviceOptions,
        userName: username,
        stockFile: form.stockFile ? form.stockFile.name : undefined,
        totalPrice: form.calculateTotal(),
        ...(editingService && { status: editingService.status }),
      }

      if (editingService) {
        console.log("editService", editingService)
        const success = await updateService(editingService._id, serviceData)
        if (success) {
          await fetchUserServices(username)
          handleCancel()
        }
      } else {
        const success = await addService(username)
        if (success) {
          await fetchUserServices(username)
          handleCancel()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce service ?"
    )
    if (confirmDelete) {
      const success = await deleteService(serviceId)
      if (success) {
        await fetchUserServices(username)
      }
    }
  }

  const handleEditService = (service: Service) => {
    form.resetForm()
    setEditingService(service)
    form.populateForm(service)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingService(null)
    setShowForm(false)
    form.resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:py-8 px-0 sm:px-6 lg:px-8">
        <div className="bg-white sm:rounded-2xl sm:shadow-lg overflow-visible sm:overflow-hidden">
          <DashboardHeader
            username={username}
            displayName={session?.user?.name}
          />
          <ToyotaLogo />
          <ServiceForm
            username={username}
            showForm={showForm}
            editingService={editingService}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Vos services
            </h3>
            <ServicesList
              services={services}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
