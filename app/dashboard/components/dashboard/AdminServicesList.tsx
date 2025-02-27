import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import {
  Loader2,
  Download,
  FileText,
  Phone,
  Calendar,
  User,
  Settings,
  Fuel,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminStore } from "@/store/AdminStore"
import { dateFormat } from "@/lib/dateFormat"

interface AdminServicesListProps {
  services: Service[]
  loading: boolean
}

export function AdminServicesList({
  services,
  loading,
}: AdminServicesListProps) {
  const { updateServiceStatus } = useAdminStore()

  const handleStatusChange = (serviceId: string, status: ServiceStatus) => {
    updateServiceStatus(serviceId, status)
  }

  const getStatusColor = (status: ServiceStatus | undefined) => {
    switch (status) {
      case "EN TRAITEMENT":
        return "bg-yellow-100 text-yellow-800"
      case "TERMINÉ":
        return "bg-green-100 text-green-800"
      case "ANNULÉ":
        return "bg-red-100 text-red-800"
      case "EN ATTENTE":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!services.length) {
    return <p className="text-center text-gray-500">Aucun service trouvé</p>
  }

  return (
    <div className="space-y-6">
      {services.map((service) => (
        <div
          key={service._id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-4 flex-1">
              {/* Client Information */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-lg">
                    {service.clientName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{service.phoneNumber}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Type ECU</p>
                    <p className="text-sm text-gray-600">{service.ecuType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Carburant</p>
                    <p className="text-sm text-gray-600">{service.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Génération</p>
                    <p className="text-sm text-gray-600">
                      {service.generation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and File */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {dateFormat(service.createdAt)}
                  </span>
                </div>
                {service.stockFile && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{service.stockFile}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Download functionality will be implemented later
                        }}
                        title="Télécharger le fichier"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Upload functionality will be implemented later
                        }}
                        title="Téléverser le fichier modifié"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="flex flex-col gap-2">
              <Select
                defaultValue={service.status}
                onValueChange={(value: ServiceStatus) =>
                  handleStatusChange(service._id, value)
                }
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
          </div>
        </div>
      ))}
    </div>
  )
}
