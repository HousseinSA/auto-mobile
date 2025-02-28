import { Service } from "@/lib/types/ServiceTypes"
import { Loader2 } from "lucide-react"
import { ServiceListItem } from "./ServiceListItem"

interface ServicesListProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
  loading?: boolean
}

export function ServicesList({
  services,
  onEdit,
  onDelete,
  loading,
}: ServicesListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!services?.length) {
    return (
      <p className="py-4 text-center text-gray-500">
        Aucun service ajouté pour le moment
      </p>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {services.map((service) => (
        <ServiceListItem
          key={service._id}
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
