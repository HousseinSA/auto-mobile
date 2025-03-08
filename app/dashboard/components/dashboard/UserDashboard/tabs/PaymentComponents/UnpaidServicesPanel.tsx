import { ServicePaymentCard } from "./ServicePaymentCard"
import { PaymentMethodsSection } from "./PaymentMethodsSection"
import NoPaymentResults from "@/shared/NoPaymentResults"
import { Service } from "@/lib/types/ServiceTypes"
import { PaymentMethod } from "@/lib/types/PaymentTypes"

interface UnpaidServicesPanelProps {
  services: Service[]
  selectedMethod: PaymentMethod
  onMethodSelect: (method: PaymentMethod) => void
  copiedField: string | null
  onCopy: (text: string) => void
  paymentProofs: { [key: string]: File }
  onProofSelect: (serviceId: string, file: File | null) => void
  onSubmitPayment: (serviceId: string) => void
  serviceLoading: { [key: string]: boolean }
}

export function UnpaidServicesPanel({
  services,
  selectedMethod,
  onMethodSelect,
  copiedField,
  onCopy,
  paymentProofs,
  onProofSelect,
  onSubmitPayment,
  serviceLoading,
}: UnpaidServicesPanelProps) {
  if (services.length === 0) {
    return <NoPaymentResults type="no-unpaid" isAdmin={false} />
  }

  return (
    <div className="space-y-4">
      <PaymentMethodsSection
        selectedMethod={selectedMethod}
        onMethodSelect={onMethodSelect}
        copiedField={copiedField}
        onCopy={onCopy}
      />
      {services.map((service) => (
        <ServicePaymentCard
          key={service._id}
          service={service}
          paymentProof={paymentProofs[service._id]}
          onProofSelect={(file) => onProofSelect(service._id, file)}
          onSubmitPayment={() => onSubmitPayment(service._id)}
          isLoading={serviceLoading[service._id]}
        />
      ))}
    </div>
  )
}