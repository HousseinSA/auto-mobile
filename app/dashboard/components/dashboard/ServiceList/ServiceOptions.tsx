import { Settings } from "lucide-react"
import { ServiceOptions as ServiceOptionsType } from "@/lib/types/ServiceTypes"

interface ServiceOptionsProps {
  serviceOptions: ServiceOptionsType
}

export function ServiceOptions({ serviceOptions }: ServiceOptionsProps) {
  return (
    <div className="lg:col-span-2 space-y-1">
      <div className="flex items-center gap-1 ">
        <Settings className="h-4 w-4 text-gray-500" />
        <p className="text-sm font-medium text-primary ">Options</p>
      </div>
      <div className="flex flex-wrap gap-1.5  ">
        {Object.entries(serviceOptions)
          .filter(([, value]) => value.selected)
          .map(([key]) => (
            <span
              key={key}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
            >
              {key}
            </span>
          ))}
      </div>
    </div>
  )
}
