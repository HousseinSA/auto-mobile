import { Service } from "@/lib/types/ServiceTypes"
import { ServiceBaseInfo } from "./ServiceBaseInfo"
import { ServiceInfo } from "./ServiceInfo"
import { ServiceStatusPrice } from "./ServiceStatusPrice"
import { ServiceActions } from "./ServiceActions"
import StockFile from "./StockFile"

interface ServiceListItemProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
}

export function ServiceListItem({
  service,
  onEdit,
  onDelete,
}: ServiceListItemProps) {
  return (
    <div className=" mb-6 p-4 flex items-start justify-between  bg-white border rounded-lg hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 flex-1">
        <ServiceBaseInfo service={service} />
        <div className="lg:col-span-2 space-y-5">
          <StockFile file={service.stockFile} />
        </div>
        <ServiceInfo service={service} />
        <ServiceStatusPrice service={service} />
      </div>
      <ServiceActions service={service} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
