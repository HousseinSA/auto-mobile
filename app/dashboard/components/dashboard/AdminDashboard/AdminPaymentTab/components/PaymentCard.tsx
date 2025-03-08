import { Payment, PaymentProof, PaymentStatus } from "@/lib/types/PaymentTypes"
import { Button } from "@/components/ui/button"
import { dateFormat } from "@/lib/globals/dateFormat"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye } from "lucide-react"
import { downloadProofFile } from "@/lib/utils/downloadUtils"
import { ServiceOptions } from "../../../UserDashboard/ServiceList/ServiceOptions"

const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "VERIFIED", label: "Vérifié" },
  { value: "FAILED", label: "Rejeté" },
]

interface PaymentCardProps {
  payment: Payment
  status: string
  onVerify: (id: string) => void
  onReject: (id: string) => void
  onViewProof: (proof: PaymentProof) => void
}

export function PaymentCard({
  payment,
  status,
  onVerify,
  onReject,
  onViewProof,
}: PaymentCardProps) {
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "border-yellow-200 bg-yellow-50/50"
      case "VERIFIED":
        return "border-green-200 bg-green-50/50"
      case "FAILED":
        return "border-red-200 bg-red-50/50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  if (!payment.service) {
    return null; // or some loading/error state
  }

  return (
    <div className={`border p-4 rounded-lg ${getStatusColor(payment.status)}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Client Information */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Client</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-primary">Name:</span>{" "}
                {payment.service.clientName}
              </p>
              <p className="text-sm">
                <span className="text-primary">Tel:</span>{" "}
                {payment.service.phoneNumber}
              </p>

              <p className="text-sm">
                <span className="text-primary">Payment ID:</span>{" "}
                #{payment.service._id.toString().slice(-6)}
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Service Details</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-primary">Fuel Type:</span>{" "}
                {payment.service.fuelType}
              </p>
              <p className="text-sm">
                <span className="text-primary">ECU:</span>{" "}
                {payment.service.ecuType}
              </p>
              <p className="text-sm">
                <span className="text-primary">Numéro de software:</span>{" "}
                {payment.service.ecuNumber}
              </p>
             <ServiceOptions serviceOptions={payment.service.serviceOptions}/>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Payment</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-primary">Amount:</span>{" "}
                  {payment.amount} €
              </p>
              <p className="text-sm">
                <span className="text-primary">Method:</span>{" "}
                    {payment.method}
              </p>
              <p className="text-sm">
                <span className="text-primary">Date:</span>{" "}
                {dateFormat(payment.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-2">
          {payment.proof && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProof(payment.proof!)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir preuve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadProofFile(payment.proof!)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {payment.proof.file.name || 'Télécharger'}
              </Button>
            </div>
          )}
          {status === "pending" && (
            <Select
              value={payment.status}
              onValueChange={(value: PaymentStatus) => {
                if (value === "VERIFIED") {
                  onVerify(payment._id)
                } else if (value === "FAILED") {
                  onReject(payment._id)
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  )
}