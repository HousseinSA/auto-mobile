import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import { Loader2 } from "lucide-react"

import { ServiceBaseInfo } from "../../UserDashboard/ServiceList/ServiceBaseInfo"
import { ServiceInfo } from "../../UserDashboard/ServiceList/ServiceInfo"

import { ClientInfo } from "./ClientInfo"
import { FileSection } from "./FileSection"
import { StatusSection } from "./StatusSection"
import { ServiceOptions } from "../../UserDashboard/ServiceList/ServiceOptions"

interface AdminServicesListProps {
  services: Service[]
  loading: boolean
}

export function AdminServicesList({
  services,
  loading,
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!services.length) {
    return <p className="text-center text-gray-500">Aucun service trouvé</p>
  }

  return (
    <div className="space-y-6">
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
              <ServiceOptions serviceOptions={service.serviceOptions} />
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
  )
}
