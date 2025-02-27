import { Service } from "@/lib/types/ServiceTypes"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { useServiceStore } from "@/store/ServiceStore"

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
  const { editingService } = useServiceStore()

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString()
  }

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
          className="py-6 flex items-start justify-between hover:bg-gray-50  transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 flex-1">
            {/* Base Info Group */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro ECU</p>
                <p className="text-sm font-mono">{service.ecuNumber}</p>
              </div>
            </div>

            {/* Options Group - Allow more space for wrapping */}
            <div className="lg:col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-2">Options</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(service.serviceOptions)
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

            {/* Info Group */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Génération</p>
                <p className="text-sm">{service.generation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date de création
                </p>
                <p className="text-sm">{formatDate(service.createdAt)}</p>
              </div>
            </div>

            {/* Status & Price Group */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">Prix Total</p>
                <p className="text-sm font-semibold">
                  {service.totalPrice.toFixed(2)} €
                </p>
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

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onEdit(service)
                document.querySelector(".service-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(service._id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
              disabled={!!editingService}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
