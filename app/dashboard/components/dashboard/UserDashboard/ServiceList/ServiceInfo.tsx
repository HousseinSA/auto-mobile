import { Settings, Calendar } from "lucide-react"
import { dateFormat } from "@/lib/globals/dateFormat"
import { Service } from "@/lib/types/ServiceTypes"

interface ServiceInfoProps {
  service: Service
}

export function ServiceInfo({ service }: ServiceInfoProps) {
  console.log(service.createdAt)
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1 ">
          <Settings className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-medium text-primary">Génération</p>
        </div>
        <p className="text-sm">{service.generation}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 ">
          <Calendar className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-medium text-primary">Date de création</p>
        </div>
        <p className="text-sm">{dateFormat(service.createdAt)}</p>
      </div>
    </div>
  )
}
