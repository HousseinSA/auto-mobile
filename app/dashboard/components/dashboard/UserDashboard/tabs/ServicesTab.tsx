import { useState } from "react"
import { Service } from "@/lib/types/ServiceTypes"
import { ServiceForm } from "../../ServiceForm/ServiceForm"
import { ServicesList } from "../ServiceList/ServicesList"
import { ServiceFilter } from "@/app/dashboard/components/shared/ServiceFilter"

interface ServicesTabProps {
  username: string
  showForm: boolean
  editingService: Service | null
  isSubmitting: boolean
  services: Service[]
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
}

export function ServicesTab({
  username,
  showForm,
  editingService,
  isSubmitting,
  services,
  loading,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: ServicesTabProps) {
  const [filterStatus, setFilterStatus] = useState("active")

  const filteredServices = services.filter((service) => {
    if (filterStatus === "active") {
      return service.status !== "TERMINÉ"
    } else if (filterStatus === "completed") {
      return service.status === "TERMINÉ"
    }
    return true
  })

  return (
    <div className="p-4 sm:pl-0 h-full ">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Services</h2>
      <ServiceForm
        username={username}
        showForm={showForm}
        editingService={editingService}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
     <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold text-primary">Vos services</h2>
          <ServiceFilter
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            className="w-full sm:w-auto"
            showSearch={false}
          />
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {filteredServices.length} service(s) trouvé(s)
        </div>
        <ServicesList
          services={filteredServices}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          filterStatus={filterStatus}
        />
      </div>
    </div>
  )
}
