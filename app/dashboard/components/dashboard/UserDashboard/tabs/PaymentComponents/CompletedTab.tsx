import { ServiceOptions } from "../../ServiceList/ServiceOptions";
import NoPaymentResults from "@/shared/NoPaymentResults";
import { Payment } from "@/lib/types/PaymentTypes";
import { dateFormat } from "@/lib/globals/dateFormat";
import { useState } from "react";
import { ProofDialog } from "../../../AdminDashboard/AdminPaymentTab/components/ProofDialog";
import { ProofViewer } from "@/lib/utils/ProofViewer";

interface CompletedTabProps {
  verifiedPayments: Payment[];
}
export function CompletedTab({ verifiedPayments }: CompletedTabProps) {
  const [selectedProof, setSelectedProof] = useState<{
    data: string;
    name: string;
  } | null>(null);

  if (verifiedPayments.length === 0) {
    return <NoPaymentResults type="no-verified" isAdmin={false} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary mb-4 sticky top-0 bg-white z-10">
        Paiements vérifiés
      </h3>
      {verifiedPayments.map((payment) => (
        <div
          key={payment._id}
          className="border p-3 sm:p-4 rounded-lg bg-green-50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content Column */}
            <div className="w-full lg:flex-1 space-y-4">
              {/* Payment Information Section */}
              <div className="border-b pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-medium">#{payment._id.slice(-6)}</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 whitespace-nowrap">
                    Paiement vérifié
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Méthode:</span>{" "}
                    {payment.method}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Montant:</span>{" "}
                    <span className="text-primary font-semibold">
                      {payment.amount}€
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
              <div className="bg-white rounded-lg p-3">
                <ProofViewer
                  proof={payment.proof}
                  isAdmin={false}
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
