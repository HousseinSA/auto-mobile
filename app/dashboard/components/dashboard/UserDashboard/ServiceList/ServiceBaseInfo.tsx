import { Fuel, Settings, Hash } from "lucide-react"
import { Service } from "@/lib/types/ServiceTypes"
import { ServiceOptions } from "./ServiceOptions"

interface ServiceBaseInfoProps {
  service: Service
  isUserDashboard?: boolean
}

export function ServiceBaseInfo({
  service,
  isUserDashboard,
}: ServiceBaseInfoProps) {
  const dtcDetails = service.serviceOptions?.DTC_OFF?.dtcDetails

  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-primary">Carburant</p>
          </div>
          <p className="text-sm">{service.fuelType}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-primary">Type d&apos;ECU</p>
          </div>
          <p className="text-sm">{service.ecuType}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-primary">
              Numéro de software
            </p>
          </div>
          <p className="text-sm font-mono">{service.ecuNumber}</p>
        </div>
        {!isUserDashboard && (
          <div className="space-y-1">
            <ServiceOptions serviceOptions={service.serviceOptions} />
          </div>
        )}
        <div className="space-y-1">
          {dtcDetails && (
            <>
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium text-primary">
                  DTC_OFF options
                </p>
              </div>
              <p className="text-sm">
               {dtcDetails}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
