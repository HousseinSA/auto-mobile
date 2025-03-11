/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useServiceStore } from "@/store/ServiceStore";
import { usePaymentStore } from "@/store/PaymentStore";
import { PaymentMethod } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";

export function usePayments() {
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

  const ITEMS_PER_PAGE = 10;

  // Initialize data
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

  // Reset pagination on tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const paymentCategories = useMemo(() => {
    if (!services?.length || !payments?.length) {
      return {
        unpaidServices: [],
        pendingPayments: [],
        verifiedPayments: [],
        rejectedPayments: [],
      };
    }

    const paidServiceIds = new Set(payments.map((p) => p.serviceId));
    const unpaidServices = services.filter(
      (service) => !paidServiceIds.has(service._id)
    );

    return {
      unpaidServices,
      pendingPayments: payments.filter((p) => p.status === "PENDING"),
      verifiedPayments: payments.filter((p) => p.status === "VERIFIED"),
      rejectedPayments: payments.filter((p) => p.status === "FAILED"),
    };
  }, [services, payments]);

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
        return { data: [], totalPages: 0 };
    }
  }, [activeTab, currentPage, paymentCategories]);

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
        proofFile,
        userName: session.user.name,
      });

      setPaymentProofs((prev) => {
        const { [selectedServiceId]: _, ...rest } = prev;
        return rest;
      });
      setShowConfirmModal(false);
      await fetchPayments(session.user.name);
    } catch (error) {
      toastMessage("error", "Erreur lors de la soumission du paiement");
    }
  };

  return {
    isLoading: (!isInitialized && paymentsLoading) || !services,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    paginatedData,
    paymentCategories,
    selectedMethod,
    setSelectedMethod,
    copiedField,
    handleCopy,
    paymentProofs,
    handlePaymentSubmit,
    handleConfirmPayment,
    showConfirmModal,
    setShowConfirmModal,
    selectedServiceId,
    serviceLoading,
    handleProofSelect: (serviceId: string, file: File | null) => {
      setPaymentProofs((prev) => {
        if (!file) {
          const { [serviceId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [serviceId]: file };
      });
    },
  };
}
