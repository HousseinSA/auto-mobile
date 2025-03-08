import { Payment, PaymentProof, PaymentStatus } from "@/lib/types/PaymentTypes"
import { Button } from "@/components/ui/button"
import { Pagination } from "./Pagination"
import NoPaymentResults from "@/shared/NoPaymentResults"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { PaymentCard } from "./PaymentCard"

interface PaymentListProps {
  payments: Payment[]
  status: string
  onVerify: (id: string) => void
  onReject: (id: string) => void
  onViewProof: (proof: PaymentProof) => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

export function PaymentList({
  payments,
  status,
  onVerify,
  onReject,
  onViewProof,
  currentPage,
  setCurrentPage,
}: PaymentListProps) {
  const [selectedStatus, setSelectedStatus] = useState<{
    paymentId: string;
    status: PaymentStatus;
  } | null>(null);

  console.log('payments',payments)
  const itemsPerPage = 10
  const totalPages = Math.ceil(payments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPayments = payments.slice(startIndex, startIndex + itemsPerPage)

  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus) => {
    setSelectedStatus({ paymentId, status: newStatus })
  }

  const handleConfirmStatusChange = () => {
    if (!selectedStatus) return
    if (selectedStatus.status === "VERIFIED") {
      onVerify(selectedStatus.paymentId)
    } else if (selectedStatus.status === "FAILED") {
      onReject(selectedStatus.paymentId)
    }
    setSelectedStatus(null)
  }

  if (!payments.length) {
    return <NoPaymentResults type={`no-${status}`} isAdmin={true} />
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {paginatedPayments.map((payment) => (
          <PaymentCard
            key={payment._id}
            payment={payment}
            status={status}
            onVerify={(id) => handleStatusChange(id, "VERIFIED")}
            onReject={(id) => handleStatusChange(id, "FAILED")}
            onViewProof={onViewProof}
          />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedStatus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer le changement de statut
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer le statut de ce paiement ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedStatus(null)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
            >
              Confirmer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}