import { ConfirmModal } from "@/lib/globals/confirm-modal"
import { useAdminPayments } from '@/hooks/useAdminPayments'
import { PaymentTabs } from "./components/PaymentTabs"
import { ProofDialog } from "./components/ProofDialog"

export function AdminPaymentTab() {
  const {
    loading,
    pendingPayments,
    verifiedPayments,
    failedPayments,
    verifyingId,
    selectedProof,
    showVerifyModal,
    showRejectModal,
    selectedPaymentId,
    currentPage,
    setCurrentPage,
    handleVerify,
    handleReject,
    handleViewProof,
    setSelectedProof,
    setShowVerifyModal,
    setShowRejectModal,
    handleConfirmVerify,
    handleConfirmReject
  } = useAdminPayments()

  return (
    <div className="p-4 space-y-6">
      <PaymentTabs
        pendingPayments={pendingPayments}
        verifiedPayments={verifiedPayments}
        failedPayments={failedPayments}
        onVerify={handleVerify}
        onReject={handleReject}
        onViewProof={handleViewProof}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ProofDialog
        selectedProof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />

      <ConfirmModal
        isOpen={showVerifyModal}
        onConfirm={handleConfirmVerify}
        onCancel={() => setShowVerifyModal(false)}
        title="Confirmer la vérification"
        description="Êtes-vous sûr de vouloir vérifier ce paiement ?"
        isLoading={verifyingId === selectedPaymentId}
      />

      <ConfirmModal
        isOpen={showRejectModal}
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectModal(false)}
        title="Confirmer le rejet"
        description="Êtes-vous sûr de vouloir rejeter ce paiement ?"
        isLoading={verifyingId === selectedPaymentId}
      />
    </div>
  )
}
