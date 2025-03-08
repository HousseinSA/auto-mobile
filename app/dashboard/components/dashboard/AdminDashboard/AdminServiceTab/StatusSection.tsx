import { useState } from "react"
import { Service, ServiceStatus } from "@/lib/types/ServiceTypes"
import { useAdminStore } from "@/store/AdminStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfirmModal } from "@/lib/globals/confirm-modal"
import TotalPrice from "../../UserDashboard/ServiceList/TotalPrice"

interface StatusSectionProps {
  service: Service
  getStatusColor: (status: ServiceStatus | undefined) => string
}

export function StatusSection({ service, getStatusColor }: StatusSectionProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<ServiceStatus | null>(null)
  const { statusUpdateLoading, updateServiceStatus } = useAdminStore()

  const handleStatusChange = (value: ServiceStatus) => {
    // if (value === "TERMINÉ") {
    //   setPendingStatus(value)
    //   setShowConfirmModal(true)
    // } else {
      updateServiceStatus(service._id, value)
    // }
  }

  const handleConfirm = () => {
    if (pendingStatus) {
      updateServiceStatus(service._id, pendingStatus)
      setPendingStatus(null)
    }
    setShowConfirmModal(false)
  }

  const handleCancel = () => {
    setPendingStatus(null)
    setShowConfirmModal(false)
  }

  const isDisabled = service.status === "TERMINÉ" || statusUpdateLoading

  return (
    <>
      <div className="flex flex-col gap-16 w-full sm:w-auto">
        <div className="gap-2 flex  flex-col">
          <Select
            value={service.status}
            onValueChange={handleStatusChange}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EN ATTENTE">En attente</SelectItem>
              <SelectItem value="EN TRAITEMENT">En traitement</SelectItem>
              <SelectItem value="TERMINÉ" disabled={true}>Terminé</SelectItem>
              <SelectItem value="ANNULÉ">Annulé</SelectItem>
            </SelectContent>
          </Select>
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center justify-center ${getStatusColor(
              service.status
            )}`}
          >
            {service.status}
          </div>
        </div>

        <TotalPrice totalPrice={service.totalPrice} />
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirmer le changement de statut"
        description="Êtes-vous sûr de vouloir marquer ce service comme terminé ? Cette action ne peut pas être annulée."
      />
    </>
  )
}
