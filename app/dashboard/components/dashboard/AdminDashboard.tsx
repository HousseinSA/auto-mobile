"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { DashboardHeader } from "./DashboardHeader/DashboardHeader"
import { CreditCard, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminServicesTab } from "./AdminDashboard/AdminServiceTab/AdminServicesTab"
import { useAdminStore } from "@/store/AdminStore"
import { AdminPaymentTab } from "./AdminDashboard/AdminPaymentTab/AdminPaymentTab"
import { ServiceFilter } from "@/app/dashboard/components/shared/ServiceFilter"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { services, loading, searchTerm, setSearchTerm, fetchAllServices } =
    useAdminStore()
  const [filterStatus, setFilterStatus] = useState<string>("active")

  useEffect(() => {
    fetchAllServices()
  }, [fetchAllServices])

  const filteredServices = services.filter((service) => {
    const searchMatch =
      service.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.ecuType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.fuelType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.status?.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "active") {
      return searchMatch && service.status !== "TERMINÉ"
    } else if (filterStatus === "completed") {
      return searchMatch && service.status === "TERMINÉ"
    }
    return searchMatch
  })

  return (
    <>
      <DashboardHeader username="admin" displayName={session?.user?.name} />
      <div className="flex flex-col sm:flex-row items-start">
        <div className="w-full mt-4 sm:mt-0">
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
                value="payments"
                className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <CreditCard className="h-4 w-4" />
                <span className="whitespace-nowrap">Paiements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="p-4 sm:p-6">
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Gestion des Services
                  </h2>
                  <ServiceFilter
                    searchTerm={searchTerm}
                    filterStatus={filterStatus}
                    onSearchChange={setSearchTerm}
                    onFilterChange={setFilterStatus}
                    className="sm:items-center"
                    showSearch={true}
                  />
                  <div className="text-sm text-gray-500">
                    {filteredServices.length} service(s) trouvé(s)
                  </div>
                </div>
                <AdminServicesTab
                  services={filteredServices}
                  loading={loading}
                  filterStatus={filterStatus}
                  searchTerm={searchTerm}
                />
              </div>
            </TabsContent>
            <TabsContent value="payments" className="p-4 sm:p-6">
              <AdminPaymentTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
