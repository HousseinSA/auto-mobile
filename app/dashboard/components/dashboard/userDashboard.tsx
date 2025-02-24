"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react"
import { useServiceStore } from "@/store/ServiceStore"
import { useFormStore } from "@/store/FormStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ECUType,
  FuelType,
  Service,
  ServiceRequest,
} from "@/lib/types/ServiceTypes"
import { DashboardHeader } from "./components/DashboardHeader"
import { ToyotaLogo } from "./components/ToyotaLogo"

interface UserDashboardProps {
  username: string
}

export default function UserDashboard({ username }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

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
  } = useServiceStore()

  const form = useFormStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Move the fetchUserServices effect to its own useEffect
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name?.toLowerCase() === username.toLowerCase()
    ) {
      fetchUserServices(username)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, username, fetchUserServices])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (
      status === "authenticated" &&
      session?.user?.name?.toLowerCase() !== username.toLowerCase()
    ) {
      router.push(`/dashboard/${session.user?.name?.toLowerCase()}`)
    }
  }, [status, session, router, username])

  // Form population effect
  useEffect(() => {
    if (editingService && showForm) {
      form.populateForm(editingService)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingService, showForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingService) {
        const serviceData: ServiceRequest = {
          fuelType: form.fuelType as FuelType,
          ecuType: form.ecuType as ECUType,
          ecuNumber: form.getFullEcuNumber(),
          serviceOptions: form.serviceOptions,
          userName: username,
          status: editingService.status,
        }

        const success = await updateService(editingService._id, serviceData)
        if (success) {
          setEditingService(null)
          setShowForm(false)
          form.resetForm()
          await fetchUserServices(username)
        }
      } else {
        const success = await addService(username)
        if (success) {
          setShowForm(false)
          form.resetForm()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      const success = await deleteService(serviceId)
      if (success) {
        await fetchUserServices(username)
      }
    }
  }

  const handleEditService = (service: Service) => {
    setShowForm(true) // First show the form
    setEditingService(service) // Then set the editing service
  }

  // Add this function to handle cancellation
  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null) // Reset editing state
    form.resetForm()
  }

  // Update the Add Service button click handler
  const handleAddServiceClick = () => {
    setEditingService(null) // Clear any editing state
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:py-8 px-0 sm:px-6 lg:px-8">
        <div className="bg-white sm:rounded-2xl sm:shadow-lg overflow-visible sm:overflow-hidden">
          {/* Header Section */}
          <DashboardHeader 
            username={username} 
            displayName={ session?.user?.name} 
          />

          {/* Toyota Logo Section */}
          <ToyotaLogo />

          {/* Service Form Section */}
          <div className="px-4 py-2 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-lg font-semibold text-primary">
                Ajouter un nouveau service
              </h3>
              {!showForm && (
                <Button
                  onClick={handleAddServiceClick} // Use new handler
                  className="bg-primary  text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un service
                </Button>
              )}
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-visible ${
                showForm
                  ? "max-h-[2000px] opacity-100 mt-6"
                  : "max-h-0 opacity-0"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label>Type de carburant</Label>
                    <Select
                      value={form.fuelType}
                      onValueChange={form.handleFuelTypeChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent
                        className="min-w-[200px]"
                        position="popper"
                        sideOffset={5}
                      >
                        <SelectItem value="Essence">Essence</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.fuelType && (
                    <div>
                      <Label>Type d&apos;ECU</Label>
                      <Select
                        value={form.ecuType}
                        onValueChange={form.handleEcuTypeChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner l'ECU" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.fuelType === "Essence" ? (
                            <>
                              <SelectItem value="Denso">Denso</SelectItem>
                              <SelectItem value="Delphi">Delphi</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Denso">Denso</SelectItem>
                              <SelectItem value="Bosch">Bosch</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {form.ecuType && (
                  <div>
                    <Label htmlFor="ecuNumber">Numéro ECU</Label>
                    <div className="flex gap-2 mt-1">
                      {form.fuelType === "Diesel" &&
                      form.ecuType === "Bosch" ? (
                        <Input
                          id="boschNumber"
                          value={form.boschNumber}
                          onChange={form.handleBoschNumberChange}
                          placeholder="EDC17C01"
                          required
                          className="flex-1"
                        />
                      ) : (
                        <div className="flex-1 flex">
                          <Input
                            value="89663-"
                            disabled
                            className="w-[4.5rem] rounded-r-none border-r-0"
                          />
                          <Input
                            id="ecuNumber"
                            value={form.ecuNumber}
                            onChange={form.handleEcuNumberChange}
                            maxLength={10}
                            minLength={5}
                            placeholder="60R51"
                            required
                            className="flex-1 rounded-l-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="mb-2 block">Options de service</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(form.serviceOptions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          className="text-white"
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            form.setServiceOptions((prev) => ({
                              ...prev,
                              [key]: checked === true,
                            }))
                          }
                        />
                        <Label htmlFor={key}>{key}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !form.fuelType ||
                      !form.ecuType ||
                      !form.getFullEcuNumber()
                    }
                    className="flex items-center gap-2 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : editingService ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Mettre a jour le service
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Ajouter le service
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Updated Services List Section */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Vos services
            </h3>
            <div className="divide-y divide-gray-200">
              {services && services.length > 0 ? (
                services.map((service, index) => (
                  <div key={`service-${index}`} className="py-4">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Carburant
                          </p>
                          <p className="text-sm">{service.fuelType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            ECU
                          </p>
                          <p className="text-sm">
                            {service.ecuType} {service.ecuNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Options
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {service.serviceOptions &&
                              Object.entries(service.serviceOptions)
                                .filter(([, value]) => value)
                                .map(([key]) => (
                                  <span
                                    key={`option-${key}`}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {key}
                                  </span>
                                ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Date
                          </p>
                          <p className="text-sm">
                            {new Date(service.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            service.status === "TERMINÉ"
                              ? "bg-green-100 text-green-800"
                              : service.status === "EN TRAITEMENT"
                              ? "bg-yellow-100 text-yellow-800"
                              : service.status === "ANNULÉ"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  Aucun service ajouté pour le moment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
