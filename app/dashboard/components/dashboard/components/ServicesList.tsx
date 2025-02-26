import { Service } from "@/lib/types/ServiceTypes"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from "lucide-react"

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
        <div
          key={service._id}
          className="py-4 flex items-center justify-between"
        >
          <div className="flex flex-wrap gap-6 md:gap-10 flex-1">
            <div>
              <p className="text-sm font-medium text-gray-500">Carburant</p>
              <p className="text-sm">{service.fuelType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Type d&apos;ECU
              </p>
              <p className="text-sm">{service.ecuType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Numéro ECU</p>
              <p className="text-sm">{service.ecuNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Génération</p>{" "}
              {/* New Generation Field */}
              <p className="text-sm">{service.generation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Options</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(service.serviceOptions)
                  .filter(([, value]) => value.selected)
                  .map(([key]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {key}
                    </span>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm">
                {(() => {
                  const date = new Date(service.createdAt)
                  const month = String(date.getMonth() + 1).padStart(2, "0")
                  const day = String(date.getDate()).padStart(2, "0")
                  const year = date.getFullYear()
                  return `${month}/${day}/${year}`
                })()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prix Total</p>
              <p className="text-sm">{service.totalPrice.toFixed(2)} €</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(service)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(service._id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
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
      ))}
    </div>
  )
}
