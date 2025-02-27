import { Service,  } from "@/lib/types/ServiceTypes"
import { ServiceForm } from "../components/ServiceForm/ServiceForm"
import { ServicesList } from "../components/ServiceList/ServicesList"

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
  return (
    <div className="p-4 sm:pl-0 ">
      <ServiceForm
        username={username}
        showForm={showForm}
        editingService={editingService}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Vos services
        </h3>
        <ServicesList
          services={services}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}
