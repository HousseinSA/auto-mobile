import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import { Loader2 } from "lucide-react"
import NoResults from "../../../shared/NoResults"

import { ServiceBaseInfo } from "../../../shared/ServiceBaseInfo"
import { ServiceInfo } from "../../../shared/ServiceInfo"

import { ClientInfo } from "./ClientInfo"
import { FileSection } from "./FileSection"
import { StatusSection } from "./StatusSection"

interface AdminServicesListProps {
  services: Service[]
  loading: boolean
  searchTerm?: string
  filterStatus?: string
}

export function AdminServicesTab({
  services,
  loading,
  searchTerm,
  filterStatus,
}: AdminServicesListProps) {
  const getStatusColor = (status: ServiceStatus | undefined) => {
    switch (status) {
      case "EN TRAITEMENT":
        return "bg-yellow-100 text-yellow-800"
      case "TERMINÉ":
        return "bg-green-100 text-green-800"
      case "ANNULÉ":
        return "bg-red-100 text-red-800"
      case "EN ATTENTE":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && !services.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!services.length) {
    return (
      <NoResults
        type={searchTerm ? "no-search-results" : "no-services"}
        isAdmin={true}
        filterStatus={filterStatus}
      />
    )
  }

  return (
    <div className="h-full overflow-y-auto sm:pl-0 ">
      <div className="space-y-6 ">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-4 flex-1">
                <ClientInfo service={service} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <ServiceBaseInfo service={service} />
                  <ServiceInfo service={service} />
                </div>
                <FileSection service={service} />
              </div>
              <StatusSection
                service={service}
                getStatusColor={getStatusColor}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
