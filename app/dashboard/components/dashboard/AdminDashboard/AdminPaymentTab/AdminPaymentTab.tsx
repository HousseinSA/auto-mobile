import { useAdminPayments } from "@/hooks/useAdminPayments";
import { PaymentTabs } from "./components/PaymentTabs";

export function AdminPaymentTab() {
  const {
    loading,
    pendingPayments,
    verifiedPayments,
    failedPayments,
    currentPage,
    setCurrentPage,
    handleVerify,
    handleReject,
  } = useAdminPayments();

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
    </>
  );
}
