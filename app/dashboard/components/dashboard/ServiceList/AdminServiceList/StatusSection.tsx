import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StatusSectionProps {
  service: Service
  onStatusChange: (serviceId: string, status: ServiceStatus) => void
  getStatusColor: (status: ServiceStatus | undefined) => string
}

export function StatusSection({ service, onStatusChange, getStatusColor }: StatusSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <Select
        defaultValue={service.status}
        onValueChange={(value: ServiceStatus) => onStatusChange(service._id, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EN ATTENTE">En attente</SelectItem>
          <SelectItem value="EN TRAITEMENT">En traitement</SelectItem>
          <SelectItem value="TERMINÉ">Terminé</SelectItem>
          <SelectItem value="ANNULÉ">Annulé</SelectItem>
        </SelectContent>
      </Select>
      <div
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(
          service.status
        )}`}
      >
        {service.status}
      </div>
    </div>
  )
}