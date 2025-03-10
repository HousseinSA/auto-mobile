import { Payment, PaymentStatus } from "@/lib/types/PaymentTypes";
import { Button } from "@/components/ui/button";
import { dateFormat } from "@/lib/globals/dateFormat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { downloadProofFile } from "@/lib/utils/downloadUtils";
import { ServiceOptions } from "../../../UserDashboard/ServiceList/ServiceOptions";
import { useState } from "react";
import { usePaymentStore } from "@/store/PaymentStore";
import { ConfirmModal } from "@/lib/globals/confirm-modal";
import { ProofViewer } from "@/lib/utils/ProofViewer";
import { ProofDialog } from "./ProofDialog";

const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "VERIFIED", label: "Vérifié" },
  { value: "FAILED", label: "Rejeté" },
];

interface PaymentCardProps {
  payment: Payment;
  status: string;
}

interface StatusChangeAction {
  type: PaymentStatus;
  paymentId: string;
}

export function PaymentCard({ payment, status }: PaymentCardProps) {
  const { verifyPayment, rejectPayment } = usePaymentStore();
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [statusChangeAction, setStatusChangeAction] =
    useState<StatusChangeAction | null>(null);
  const [selectedProof, setSelectedProof] = useState<{
    data: string;
    name: string;
  } | null>(null);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "border-yellow-200 bg-yellow-50";
      case "VERIFIED":
        return "border-green-200 bg-green-50";
      case "FAILED":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const handleStatusChange = (value: PaymentStatus) => {
    if (isStatusChanging) return;
    setStatusChangeAction({ type: value, paymentId: payment._id });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeAction || isStatusChanging) return;

    setIsStatusChanging(true);
    try {
      if (statusChangeAction.type === "VERIFIED") {
        await verifyPayment(statusChangeAction.paymentId);
      } else if (statusChangeAction.type === "FAILED") {
        await rejectPayment(statusChangeAction.paymentId);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la modification du statut de paiement:",
        error
      );
    } finally {
      setIsStatusChanging(false);
      setStatusChangeAction(null);
    }
  };

  if (!payment.service) {
    return null;
  }

  return (
    <>
      <div
        className={`border p-4 rounded-lg ${getStatusColor(payment.status)}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Client</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="text-primary">Nom:</span>{" "}
                  {payment.service.clientName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-primary">Téléphone:</span>{" "}
                  {payment.service.phoneNumber}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="text-primary">ID de paiement:</span> #
                  {payment._id.toString().slice(-6)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Détails du service</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="text-primary">Type de carburant:</span>{" "}
                  {payment.service.fuelType}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-primary">ECU:</span>{" "}
                  {payment.service.ecuType}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-primary">Numéro de software:</span>{" "}
                  {payment.service.ecuNumber}
                </p>
                <ServiceOptions
                  serviceOptions={payment.service.serviceOptions}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-primary">Paiement</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="text-primary ">Montant:</span>{" "}
                  {payment.amount} €
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-primary">Méthode:</span>{" "}
                  {payment.method}
                </p>
                <p className="text-sm text-gray-600 ">
                  <span className="text-primary">Date:</span>{" "}
                  {dateFormat(payment.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end items-center gap-2">
            {payment.proof && (
              <div className="flex flex-wrap items-center gap-2">
                <ProofViewer
                  proof={payment.proof}
                  isAdmin={true}
                  onView={(proofData) => setSelectedProof(proofData)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadProofFile(payment.proof!)}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  {payment.proof.file.name || "Télécharger"}
                </Button>
              </div>
            )}
            {status === "pending" && (
              <Select
                value={payment.status}
                onValueChange={handleStatusChange}
                disabled={isStatusChanging}
              >
                <SelectTrigger className="w-full sm:w-[180px] min-w-[150px]">
                  <SelectValue
                    placeholder={
                      isStatusChanging ? "Mise à jour..." : "Changer le statut"
                    }
                  />
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

      <ProofDialog
        selectedProof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />

      <ConfirmModal
        isOpen={!!statusChangeAction}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusChangeAction(null)}
        title={`Confirmer la ${
          statusChangeAction?.type === "VERIFIED" ? "vérification" : "rejet"
        }`}
        description={`Êtes-vous sûr de vouloir ${
          statusChangeAction?.type === "VERIFIED" ? "vérifier" : "rejeter"
        } ce paiement ?`}
        isLoading={isStatusChanging}
      />
    </>
  );
}
