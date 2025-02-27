"use client"

import { useSession } from "next-auth/react"
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
import { DashboardHeader } from "./components/DashboardHeader/DashboardHeader"
import { ToyotaLogo } from "./components/DashboardHeader/ToyotaLogo"
import { CreditCard, FileText, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServicesTab } from "./tabs/ServicesTab"
import { FilesTab } from "./tabs/FilesTab"
import { PaymentsTab } from "./tabs/PaymentsTab"

interface UserDashboardProps {
  username: string
}

export default function UserDashboard({ username }: UserDashboardProps) {
  const { data: session, status } = useSession()
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
      <div className="max-w-7xl mx-auto md:py-8 sm:px-6 lg:px-8">
        <div className="bg-white sm:rounded-2xl sm:shadow-lg ">
          <DashboardHeader
            username={username}
            displayName={session?.user?.name}
          />
          <div className="flex flex-col sm:flex-row items-start ">
            <ToyotaLogo />
            <div className="w-full mt-4 sm:mt-0 sm:ml-4">
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="w-full flex flex-col sm:flex-row justify-start sm:justify-end gap-2 sm:gap-4 sm:py-4 px-4">
                  <TabsTrigger
                    value="services"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="whitespace-nowrap">Services</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="whitespace-nowrap">Mes fichiers</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="whitespace-nowrap">Paiements</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="services">
                  <ServicesTab
                    username={username}
                    showForm={showForm}
                    editingService={editingService}
                    isSubmitting={isSubmitting}
                    services={services}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                </TabsContent>

                <TabsContent value="files">
                  <FilesTab />
                </TabsContent>

                <TabsContent value="payments">
                  <PaymentsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
