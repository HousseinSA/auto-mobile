import { User, Phone } from "lucide-react"
import { Service } from "@/lib/types/ServiceTypes"

interface ClientInfoProps {
  service: Service
}

export function ClientInfo({ service }: ClientInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <h3 className="font-semibold text-lg text-primary">
          {service.clientName}
        </h3>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Phone className="h-4 w-4" />
        <span className="text-sm">{service.phoneNumber}</span>
      </div>
    </div>
  )
}