/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useServiceStore } from "@/store/ServiceStore";
import { usePaymentStore } from "@/store/PaymentStore";
import { PaymentMethod } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
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
import { Pagination } from "../../AdminDashboard/AdminPaymentTab/components/Pagination";
import TabTrigger from "@/lib/utils/TabTrigger";
import { ScrollableTabContent } from "@/lib/utils/ScrollableContent";

export function PaymentsTab() {
  const { data: session } = useSession();
  const { services } = useServiceStore();
  const {
    payments,
    submitPayment,
    serviceLoading,
    loading: paymentsLoading,
    fetchPayments,
  } = usePaymentStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("unpaid");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized && session?.user?.name) {
        try {
          await fetchPayments(session.user.name);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeData();
  }, [session?.user?.name, isInitialized, fetchPayments]);

  // Memoize payment categories with proper dependency tracking
  const paymentCategories = useMemo(() => {
    // Remove the length check for services since we want to show unpaid even if no payments exist
    if (!services) {
      return {
        unpaidServices: [],
        pendingPayments: [],
        verifiedPayments: [],
        rejectedPayments: [],
      };
    }

    // Initialize with empty arrays for payments if none exist
    const paidServiceIds = new Set(payments?.map((p) => p.serviceId) || []);

    // Filter unpaid services
    const unpaidServices = services.filter(
      (service) => !paidServiceIds.has(service._id)
    );

    return {
      unpaidServices,
      pendingPayments: payments?.filter((p) => p.status === "PENDING") || [],
      verifiedPayments: payments?.filter((p) => p.status === "VERIFIED") || [],
      rejectedPayments: payments?.filter((p) => p.status === "FAILED") || [],
    };
  }, [services, payments]);

  // Update loading state to only check for services
  const isLoading = useMemo(() => {
    return !services;
  }, [services]);

  // Memoize tab options to prevent recreation

  const tabOptions = useMemo(
    () => [
      {
        value: "unpaid",
        label: `À payer (${paymentCategories.unpaidServices.length})`,
      },
      {
        value: "pending",
        label: `En attente (${paymentCategories.pendingPayments.length})`,
      },
      {
        value: "completed",
        label: `Vérifiés (${paymentCategories.verifiedPayments.length})`,
      },
      {
        value: "rejected",
        label: `Rejetés (${paymentCategories.rejectedPayments.length})`,
      },
    ],
    [paymentCategories]
  );

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
        userName: session.user.name,
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

  const PaymentLoader = () => (
    <div className="h-[400px] w-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  console.log(payments);

  // Calculate paginated data for current tab
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    switch (activeTab) {
      case "pending":
        return {
          data: paymentCategories.pendingPayments.slice(startIndex, endIndex),
          totalPages: Math.ceil(
            paymentCategories.pendingPayments.length / ITEMS_PER_PAGE
          ),
        };
      case "completed":
        return {
          data: paymentCategories.verifiedPayments.slice(startIndex, endIndex),
          totalPages: Math.ceil(
            paymentCategories.verifiedPayments.length / ITEMS_PER_PAGE
          ),
        };
      case "rejected":
        return {
          data: paymentCategories.rejectedPayments.slice(startIndex, endIndex),
          totalPages: Math.ceil(
            paymentCategories.rejectedPayments.length / ITEMS_PER_PAGE
          ),
        };
      default:
        return {
          data: [],
          totalPages: 0,
        };
    }
  }, [activeTab, currentPage, paymentCategories]);

  return (
    <div className="flex flex-col h-full px-4 sm:pl-0 sm:pr-4">
      <h2 className="text-2xl font-semibold text-primary mb-2 shrink-0">
        Paiements
      </h2>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        {/* Mobile Select with reduced margin */}
        <div className="block md:hidden mb-1">
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

        {/* Desktop tabs with reduced margin */}
        <TabsList className="hidden md:grid w-full grid-cols-4 mb-6">
          <TabTrigger
            value="unpaid"
            isActive={activeTab === "unpaid"}
            onClick={() => setActiveTab("unpaid")}
          >
            À payer ({paymentCategories.unpaidServices.length})
          </TabTrigger>
          <TabTrigger
            value="pending"
            isActive={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            En attente ({paymentCategories.pendingPayments.length})
          </TabTrigger>
          <TabTrigger
            value="completed"
            isActive={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            Vérifiés ({paymentCategories.verifiedPayments.length})
          </TabTrigger>
          <TabTrigger
            value="rejected"
            isActive={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
          >
            Rejetés ({paymentCategories.rejectedPayments.length})
          </TabTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="unpaid" className="h-full">
            {isLoading ? (
              <PaymentLoader />
            ) : (
              <ScrollableTabContent>
                <UnpaidTab
                  unpaidServices={paymentCategories.unpaidServices}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  copiedField={copiedField}
                  onCopy={handleCopy}
                  paymentProofs={paymentProofs}
                  onProofSelect={handleProofSelect}
                  onSubmitPayment={handlePaymentSubmit}
                  serviceLoading={serviceLoading}
                />
              </ScrollableTabContent>
            )}
          </TabsContent>

          {/* Update other TabsContent components similarly */}
          <TabsContent value="pending" className="h-full">
            {isLoading ? (
              <PaymentLoader />
            ) : (
              <ScrollableTabContent>
                <PendingTab pendingPayments={paginatedData.data} />
                <div className="sticky bottom-0 left-0 right-0 bg-white  p-2 mt-auto">
                  {paginatedData.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={paginatedData.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </ScrollableTabContent>
            )}
          </TabsContent>

          <TabsContent value="completed" className="h-full">
            {isLoading ? (
              <PaymentLoader />
            ) : (
              <ScrollableTabContent>
                <CompletedTab verifiedPayments={paginatedData.data} />
                <div className="sticky bottom-0 left-0 right-0 bg-white p-2 mt-auto">
                  {paginatedData.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={paginatedData.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </ScrollableTabContent>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="h-full">
            {isLoading ? (
              <PaymentLoader />
            ) : (
              <ScrollableTabContent>
                <RejectedTab rejectedPayments={paginatedData.data} />
                <div className="sticky bottom-0 left-0 right-0 bg-white p-2 mt-auto">
                  {paginatedData.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={paginatedData.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </ScrollableTabContent>
            )}
          </TabsContent>
        </div>
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
