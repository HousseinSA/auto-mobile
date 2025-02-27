import { Service } from "@/lib/types/ServiceTypes"
import { Loader2, Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminStore } from "@/store/AdminStore"

interface AdminServicesListProps {
  services: Service[]
  loading: boolean
}

export function AdminServicesList({
  services,
  loading,
}: AdminServicesListProps) {
  const { updateServiceStatus } = useAdminStore()

  const handleStatusChange = (serviceId: string, status: string) => {
    updateServiceStatus(serviceId, status)
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
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">
                Client: {service.clientName}
              </h3>
              <p className="text-sm text-gray-500">
                Utilisateur: {service.userName}
              </p>
              <p className="text-sm text-gray-500">
                ECU: {service.ecuType} - {service.ecuNumber}
              </p>
              <div className="mt-2">
                {service.stockFile && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{service.stockFile}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        // Download functionality will be implemented later
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Select
                defaultValue={service.status}
                onValueChange={(value) =>
                  handleStatusChange(service._id, value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN ATTENTE">En attente</SelectItem>
                  <SelectItem value="APPROUVE">Approuvé</SelectItem>
                  <SelectItem value="REJETE">Rejeté</SelectItem>
                  <SelectItem value="EN COURS">En cours</SelectItem>
                  <SelectItem value="TERMINE">Terminé</SelectItem>
                </SelectContent>
              </Select>
              {/* <Badge
                variant={
                  service.status === "APPROUVE"
                    ? "success"
                    : service.status === "REJETE"
                    ? "destructive"
                    : service.status === "EN COURS"
                    ? "warning"
                    : service.status === "TERMINE"
                    ? "default"
                    : "secondary"
                }
              >
                {service.status}
              </Badge> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
