import { Fuel, Settings, Hash } from "lucide-react"

import { Service } from "@/lib/types/ServiceTypes"

interface ServiceBaseInfoProps {
  service: Service
}

export function ServiceBaseInfo({ service }: ServiceBaseInfoProps) {
  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 ">
            <Fuel className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-primary">Carburant</p>
          </div>
          <p className="text-sm">{service.fuelType}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 ">
            <Settings className="h-4 w-4 text-gray-500" />

            <p className="text-sm font-medium text-primary">Type d&apos;ECU</p>
          </div>
          <p className="text-sm">{service.ecuType}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 ">
          <Hash className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-medium text-primary">Numéro ECU</p>
        </div>
        <p className="text-sm font-mono">{service.ecuNumber}</p>
      </div>
    </div>
  )
}
