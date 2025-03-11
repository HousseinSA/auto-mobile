import { Payment, PaymentStatus } from "@/lib/types/PaymentTypes";
import { Pagination } from "./Pagination";
import NoPaymentResults from "@/shared/NoPaymentResults";
import { useState, useMemo } from "react";
import { PaymentCard } from "./PaymentCard";
import { ConfirmModal } from "@/lib/globals/confirm-modal";

interface PaymentListProps {
  payments: Payment[];
  status: string;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function PaymentList({
  payments,
  status,
  onVerify,
  onReject,
  currentPage,
  setCurrentPage,
}: PaymentListProps) {
  const [selectedStatus, setSelectedStatus] = useState<{
    paymentId: string;
    status: PaymentStatus;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize pagination calculations
  const { paginatedPayments, totalPages } = useMemo(() => {
    const itemsPerPage = 10;
    const total = Math.ceil(payments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = payments.slice(startIndex, startIndex + itemsPerPage);

    return {
      paginatedPayments: paginated,
      totalPages: total,
    };
  }, [payments, currentPage]);

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus || isProcessing) return;

    setIsProcessing(true);
    try {
      if (selectedStatus.status === "VERIFIED") {
        await onVerify(selectedStatus.paymentId);
      } else if (selectedStatus.status === "FAILED") {
        await onReject(selectedStatus.paymentId);
      }
    } finally {
      setIsProcessing(false);
      setSelectedStatus(null);
    }
  };

  if (!payments.length) {
    // @ts-expect-error fix
    return <NoPaymentResults type={`no-${status}`} isAdmin={true} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {paginatedPayments.map((payment) => (
          <PaymentCard key={payment._id} payment={payment} status={status} />
        ))}
      </div>

      <ConfirmModal
        isOpen={!!selectedStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setSelectedStatus(null)}
        title={`Confirmer le ${
          selectedStatus?.status === "VERIFIED" ? "vérification" : "rejet"
        }`}
        description={`Êtes-vous sûr de vouloir ${
          selectedStatus?.status === "VERIFIED" ? "vérifier" : "rejeter"
        } ce paiement ?`}
        isLoading={isProcessing}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
