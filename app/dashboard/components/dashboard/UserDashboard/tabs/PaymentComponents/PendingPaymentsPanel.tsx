import { Service } from "@/lib/types/ServiceTypes"
import { PaymentProof } from "@/lib/types/PaymentTypes"
import NoPaymentResults from "@/shared/NoPaymentResults"

interface PendingPaymentsPanelProps {
  services: Service[]
  onViewProof: (proof: PaymentProof) => void
  onDownloadProof: (proof: PaymentProof) => void
}

export function PendingPaymentsPanel({
  services,
}: PendingPaymentsPanelProps) {
  if (services.length === 0) {
    return <NoPaymentResults type="no-pending" isAdmin={false} />
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary mb-4">
        Paiements en attente
      </h3>
      {services.map((service) => (
        <div key={service._id} className="border p-4 rounded-lg bg-yellow-50">
          {/* Keep existing pending payment card content */}
          {/* ... */}
        </div>
      ))}
    </div>
  )
}