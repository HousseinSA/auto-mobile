import { Service } from "@/lib/types/ServiceTypes"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useServiceStore } from "@/store/ServiceStore"
import { useState } from "react"
import { ConfirmModal } from "@/lib/confirm-modal"

interface ServiceActionsProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
}

export function ServiceActions({
  service,
  onEdit,
  onDelete,
}: ServiceActionsProps) {
  const { editingService } = useServiceStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <>
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
          onClick={() => setShowDeleteModal(true)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          disabled={!!editingService}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={() => {
          onDelete(service._id)
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
        title="Supprimer le service"
        description="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
      />
    </>
  )
}