"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { UserCircle, LogOut, Plus, X } from "lucide-react"
import { useServiceStore } from "@/store/ServiceStore"
import { useServiceForm } from "@/lib/hooks/useServiceForm"
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
import { UserSettingsModal } from "./UserSettingsModal"

interface DashboardProps {
  username: string
}

export default function Dashboard({ username }: DashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { services, loading, showForm, setShowForm, fetchUserServices } =
    useServiceStore()
  const form = useServiceForm(username)

  const handleSubmit = async (e: React.FormEvent) => {
    const success = await form.handleSubmit(e)
    if (success) {
      setShowForm(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (
      status === "authenticated" &&
      session.user?.name?.toLowerCase() !== username.toLowerCase()
    ) {
      router.push(`/dashboard/${session.user?.name?.toLowerCase()}`)
      return
    }
    fetchUserServices(username)
  }, [status, session, router, username, fetchUserServices])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-16 w-16 text-primary" />
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl  font-bold text-primary">
                    Tableau de bord de {session?.user?.name}
                  </h2>
                  <p className="text-gray-500">
                    Gérez votre compte et vos paramètres
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserSettingsModal username={username} />
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Service Form Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-lg font-semibold text-primary">
                Ajouter un nouveau service
              </h3>
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary  text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un service
                </Button>
              )}
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showForm
                  ? "max-h-[2000px] opacity-100 mt-6"
                  : "max-h-0 opacity-0"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Type de carburant</Label>
                    <Select
                      value={form.fuelType}
                      onValueChange={form.handleFuelTypeChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
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
                          placeholder="Entrez le numéro Bosch"
                          required
                          className="flex-1"
                        />
                      ) : (
                        <>
                          <Input value="89663" disabled className="w-24" />
                          <Input
                            id="ecuNumber"
                            value={form.ecuNumber}
                            onChange={form.handleEcuNumberChange}
                            maxLength={5}
                            required
                            className="flex-1"
                          />
                        </>
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
                    disabled={loading}
                    className="flex items-center gap-2 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    {loading ? "Ajout en cours..." : "Ajouter le service"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      form.resetForm()
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Services List Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Vos services</h3>
            <div className="divide-y divide-gray-200">
              {services && services.length > 0 ? (
                services.map((service, index) => (
                  <div key={`service-${index}`} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{service?.clientName}</p>
                        <p className="text-sm text-gray-500">
                          {service?.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          ECU: {service?.ecuType} {service?.ecuNumber}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {service?.serviceOptions &&
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service?.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : service?.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {service?.status}
                      </span>
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
