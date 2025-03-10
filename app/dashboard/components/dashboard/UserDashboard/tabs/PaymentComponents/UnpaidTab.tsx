import { ServicePaymentCard } from "./ServicePaymentCard"
import { PaymentMethodsSection } from "./PaymentMethodsSection"
import NoPaymentResults from "@/shared/NoPaymentResults"
import { PaymentMethod } from "@/lib/types/PaymentTypes"
import { Service } from "@/lib/types/ServiceTypes"

interface UnpaidTabProps {
  unpaidServices: Service[]
  selectedMethod: PaymentMethod
  setSelectedMethod: (method: PaymentMethod) => void
  copiedField: string | null
  onCopy: (text: string) => void
  paymentProofs: { [key: string]: File }
  onProofSelect: (serviceId: string, file: File | null) => void
  onSubmitPayment: (serviceId: string) => void
  serviceLoading: { [key: string]: boolean }
}

export function UnpaidTab({
  unpaidServices,
  selectedMethod,
  setSelectedMethod,
  copiedField,
  onCopy,
  paymentProofs,
  onProofSelect,
  onSubmitPayment,
  serviceLoading,
}: UnpaidTabProps) {
  if (unpaidServices.length === 0) {
    return <NoPaymentResults type="no-unpaid" isAdmin={false} />
  }

  return (
    <div className="space-y-4">
      <PaymentMethodsSection
        selectedMethod={selectedMethod}
        onMethodSelect={setSelectedMethod}
        copiedField={copiedField}
        onCopy={onCopy}
      />
      <h3 className='text-primary font-medium text-lg'>Services A payer</h3>
      <div className="space-y-4">
        {unpaidServices.map((service) => (
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
    </div>
  )
}