import { useAdminPayments } from '@/hooks/useAdminPayments'
import { PaymentTabs } from "./components/PaymentTabs"
import { ProofDialog } from "./components/ProofDialog"

export function AdminPaymentTab() {
  const {
    loading,
    pendingPayments,
    verifiedPayments,
    failedPayments,
    selectedProof,
    currentPage,
    setCurrentPage,
    handleVerify,
    handleReject,
    setSelectedProof,
  } = useAdminPayments()

  return (
    <>
      <PaymentTabs
        pendingPayments={pendingPayments}
        verifiedPayments={verifiedPayments}
        failedPayments={failedPayments}
        onVerify={handleVerify}
        onReject={handleReject}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ProofDialog
        selectedProof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />
</>
  )
}
