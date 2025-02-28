import { Service } from "@/lib/types/ServiceTypes"
import { Tag, CheckCircle } from "lucide-react"

interface ServiceStatusPriceProps {
  service: Service
}

export function ServiceStatusPrice({ service }: ServiceStatusPriceProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-1">
        <div className="flex items-center gap-1 ">
          <Tag className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-medium text-primary">Prix Total</p>
        </div>
        <p className="text-sm font-semibold">
          {service.totalPrice.toFixed(2)} €
        </p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 ">
          <CheckCircle className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-medium text-primary">Status</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs w-fit ${
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
  )
}
