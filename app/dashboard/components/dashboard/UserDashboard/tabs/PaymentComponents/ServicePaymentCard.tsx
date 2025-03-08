import { Service } from "@/lib/types/ServiceTypes"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PaymentProofUpload } from "../../../PaymentProof/PaymentProofUpload"
import { ServiceDetails } from "./ServiceDetails"

interface ServicePaymentCardProps {
  service: Service
  paymentProof: File | null
  onProofSelect: (file: File | null) => void
  onSubmitPayment: () => void
  isLoading: boolean
}

export function ServicePaymentCard({
  service,
  paymentProof,
  onProofSelect,
  onSubmitPayment,
  isLoading,
}: ServicePaymentCardProps) {
  return (
    <div className="border p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <ServiceDetails service={service} />
        <div className="flex flex-col gap-4">
          <PaymentProofUpload
            file={paymentProof}
            onFileSelect={onProofSelect}
            serviceId={service._id}
          />
          <Button
            onClick={onSubmitPayment}
            disabled={!paymentProof || isLoading}
            className="w-full text-white bg-primary hover:bg-primary/90"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Déclarer le paiement
          </Button>
        </div>
      </div>
    </div>
  )
}