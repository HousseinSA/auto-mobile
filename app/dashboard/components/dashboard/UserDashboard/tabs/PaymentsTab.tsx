/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useServiceStore } from "@/store/ServiceStore";
import { usePaymentStore } from "@/store/PaymentStore";
import { PaymentMethod } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/utils";
import { ConfirmModal } from "@/lib/globals/confirm-modal";
import { UnpaidTab } from "./PaymentComponents/UnpaidTab";
import { PendingTab } from "./PaymentComponents/PendingTab";
import { CompletedTab } from "./PaymentComponents/CompletedTab";
import { Loader2 } from "lucide-react";
import { RejectedTab } from "./PaymentComponents/RejectedTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

export function PaymentsTab() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = useSession();
  const { services } = useServiceStore();
  const {
    payments,
    submitPayment,
    serviceLoading,
    loading: paymentsLoading,
    fetchPayments,
  } = usePaymentStore();

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("BANKILY");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentProofs, setPaymentProofs] = useState<{ [key: string]: File }>(
    {}
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("unpaid");

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (session?.user?.name) {
          await fetchPayments(session.user.name);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized && session?.user?.name) {
      initializeData();
    }
  }, [isInitialized, fetchPayments, session?.user?.name]);

  const unpaidServices = useMemo(() => {
    if (!isInitialized || !services || !payments) return [];

    return services.filter((service) => {
      const hasPayment = payments.some(
        (payment) => payment.serviceId === service._id
      );
      return !hasPayment;
    });
  }, [services, payments, isInitialized]);

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  );

  const verifiedPayments = payments.filter(
    (payment) => payment.status === "VERIFIED"
  );

  const rejectedPayments = payments.filter(
    (payment) => payment.status === "FAILED"
  );

  // Move tabOptions here, after all payment arrays are defined
  const tabOptions = [
    { value: "unpaid", label: `À payer (${unpaidServices.length})` },
    { value: "pending", label: `En attente (${pendingPayments.length})` },
    { value: "completed", label: `Vérifiés (${verifiedPayments.length})` },
    { value: "rejected", label: `Rejetés (${rejectedPayments.length})` },
  ];

  // Handlers
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(text);
    toastMessage("success", "Copié dans le presse-papiers");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaymentSubmit = async (serviceId: string) => {
    const proofFile = paymentProofs[serviceId];
    if (!proofFile) {
      toastMessage("error", "Veuillez d'abord ajouter une preuve de paiement");
      return;
    }

    setSelectedServiceId(serviceId);
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedServiceId || !session?.user?.name) return;

    const proofFile = paymentProofs[selectedServiceId];
    const selectedService = services.find((s) => s._id === selectedServiceId);

    if (!selectedService) {
      toastMessage("error", "Service non trouvé");
      return;
    }

    try {
      await submitPayment(selectedServiceId, {
        method: selectedMethod,
        amount: selectedService.totalPrice,
        proofFile: proofFile,
        userName: session.user.name, // Use session username
      });

      setPaymentProofs((prev) => {
        const newProofs = { ...prev };
        delete newProofs[selectedServiceId];
        return newProofs;
      });
      setShowConfirmModal(false);

      // Refetch with session username
      await fetchPayments(session.user.name);
    } catch (error) {
      toastMessage("error", "Erreur lors de la soumission du paiement");
    }
  };

  const handleProofSelect = (serviceId: string, file: File | null) => {
    setPaymentProofs((prev) => {
      if (!file) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: file };
    });
  };

  const handleRetryPayment = async (paymentId: string, file: File) => {
    try {
      await usePaymentStore.getState().uploadPaymentProof(paymentId, file);

      const tabsElement = document.querySelector('[role="tablist"]');
      const pendingTab = tabsElement?.querySelector(
        '[value="pending"]'
      ) as HTMLElement;
      if (pendingTab) {
        pendingTab.click();
      }

      toastMessage(
        "success",
        "Nouvelle preuve de paiement envoyée avec succès"
      );
    } catch (error) {
      toastMessage("error", "Erreur lors de la mise à jour du paiement");
      throw error;
    }
  };
  const isLoading = !isInitialized || paymentsLoading;
  const PaymentLoader = () => (
    <div className="h-[400px] w-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">Paiements</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Show Select on mobile, Tabs on desktop */}
        <div className="block md:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {tabOptions.find((tab) => tab.value === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsList className="hidden md:grid w-full grid-cols-4 mb-6">
          <TabsTrigger
            value="unpaid"
            className={cn(
              "text-primary",
              "data-[state=active]:bg-primary",
              "data-[state=active]:text-white"
            )}
          >
            À payer ({unpaidServices.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className={cn(
              "text-primary",
              "data-[state=active]:bg-primary",
              "data-[state=active]:text-white"
            )}
          >
            En attente ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className={cn(
              "text-primary",
              "data-[state=active]:bg-primary",
              "data-[state=active]:text-white"
            )}
          >
            Vérifiés ({verifiedPayments.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className={cn(
              "text-primary",
              "data-[state=active]:bg-primary",
              "data-[state=active]:text-white"
            )}
          >
            Rejetés ({rejectedPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid" className="flex-1 overflow-auto">
          {isLoading ? (
            <PaymentLoader />
          ) : (
            <UnpaidTab
              unpaidServices={unpaidServices}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              copiedField={copiedField}
              onCopy={handleCopy}
              paymentProofs={paymentProofs}
              onProofSelect={handleProofSelect}
              onSubmitPayment={handlePaymentSubmit}
              serviceLoading={serviceLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="flex-1 overflow-auto">
          {isLoading ? (
            <PaymentLoader />
          ) : (
            <PendingTab pendingPayments={pendingPayments} />
          )}
        </TabsContent>

        <TabsContent value="completed" className="flex-1 overflow-auto">
          {isLoading ? (
            <PaymentLoader />
          ) : (
            <CompletedTab verifiedPayments={verifiedPayments} />
          )}
        </TabsContent>

        <TabsContent value="rejected" className="flex-1 overflow-auto">
          {isLoading ? (
            <PaymentLoader />
          ) : (
            <RejectedTab
              rejectedPayments={rejectedPayments}
              onRetryPayment={handleRetryPayment}
            />
          )}
        </TabsContent>
      </Tabs>
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmPayment}
        onCancel={() => setShowConfirmModal(false)}
        title="Confirmer le paiement"
        description={`Voulez-vous soumettre le paiement avec la preuve fournie ?`}
        isLoading={
          selectedServiceId ? serviceLoading[selectedServiceId] : false
        }
      />
    </div>
  );
}
