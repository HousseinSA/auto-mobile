import NoPaymentResults from "@/shared/NoPaymentResults";
import { ServiceOptions } from "../../ServiceList/ServiceOptions";
import { ProofViewer } from "@/lib/utils/ProofViewer";
import { Payment } from "@/lib/types/PaymentTypes";
import { dateFormat } from "@/lib/globals/dateFormat";
import { useState } from "react";
import { ProofDialog } from "../../../AdminDashboard/AdminPaymentTab/components/ProofDialog";
import { usePaymentStore } from "@/store/PaymentStore";

interface RejectedTabProps {
  rejectedPayments: Payment[];
}

export function RejectedTab({ rejectedPayments }: RejectedTabProps) {
  const [selectedProof, setSelectedProof] = useState<{
    data: string;
    name: string;
  } | null>(null);
  const { uploadPaymentProof } = usePaymentStore();

  if (rejectedPayments.length === 0) {
    return <NoPaymentResults type="no-failed" isAdmin={false} />;
  }
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary sticky top-0 bg-white z-10 py-2">
        Paiements rejetés
      </h3>
      {rejectedPayments.map((payment) => (
        <div
          key={payment._id}
          className="border p-3 sm:p-4 rounded-lg bg-red-50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content Column */}
            <div className="w-full lg:flex-1 space-y-4">
              <div className="border-b pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-medium">#{payment._id.slice(-6)}</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 whitespace-nowrap">
                    Paiement rejeté
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Méthode:</span>{" "}
                    {payment.method}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Montant:</span>{" "}
                    <span className="text-primary font-medium">
                      {payment.amount} €
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Date:</span>{" "}
                    {dateFormat(payment.createdAt)}
                  </p>
                </div>
              </div>

              {/* Service Information Section */}
              <div className="bg-white rounded-lg p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Carburant:</span>{" "}
                    {payment.service.fuelType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">ECU:</span>{" "}
                    {payment.service.ecuType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Software:</span>{" "}
                    {payment.service.ecuNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Date:</span>{" "}
                    {dateFormat(payment.service.createdAt)}
                  </p>
                </div>
                <div className="mt-2">
                  <ServiceOptions
                    serviceOptions={payment.service.serviceOptions}
                  />
                </div>
              </div>
            </div>

            {/* Proof Section */}
            <div className="w-full lg:w-72">
              <h4 className="text-sm font-medium text-primary mb-2">
                Preuve de Paiement
              </h4>
              <div className="rounded-lg p-3">
                <ProofViewer
                  proof={payment.proof}
                  isAdmin={false}
                  onProofChange={async (file) => {
                    try {
                      await uploadPaymentProof(payment._id, file);
                      return Promise.resolve();
                    } catch (error) {
                      return Promise.reject(error);
                    }
                  }}
                  serviceId={payment._id}
                  onView={(proofData) => setSelectedProof(proofData)}
                  status={payment.status}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <ProofDialog
        selectedProof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />
    </div>
  );
}
