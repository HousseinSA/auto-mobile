import { create } from "zustand";
import { PaymentMethod, Payment, PaymentProof } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";

interface PaymentStore {
  currentUser: string | null;
  payments: Payment[];
  loading: boolean;
  error: string | null;
  adminPaymentDetails: {
    paypal: string;
    bankily: string;
  };
  serviceLoading: { [key: string]: boolean };
  submitPayment: (
    serviceId: string,
    details: {
      method: PaymentMethod;
      amount: number;
      proofFile?: File;
      userName: string;
    }
  ) => Promise<void>;
  uploadPaymentProof: (paymentId: string, file: File) => Promise<void>;
  verifyPayment: (serviceId: string) => Promise<void>;
  fetchPayments: (username?: string) => Promise<void>;
  downloadPaymentProof: (proof: PaymentProof) => void;
  rejectPayment: (serviceId: string) => Promise<void>;
  retryPayment: (paymentId: string, file: File) => Promise<void>;
  setCurrentUser: (username: string) => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  currentUser: null,
  payments: [],
  loading: false,
  error: null,
  adminPaymentDetails: {
    paypal: "",
    bankily: "",
  },
  serviceLoading: {},
  setCurrentUser: (username: string) => set({ currentUser: username }),
  submitPayment: async (serviceId, details) => {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [serviceId]: true },
    }));

    try {
      const formData = new FormData();
      formData.append("serviceId", serviceId);
      formData.append("proof", details.proofFile!);
      formData.append("method", details.method);
      formData.append("amount", details.amount.toString());
      formData.append("userName", details.userName);

      const response = await fetch("/api/payments/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit payment");
      }

      // Fetch payments with currentUser or username to ensure proper filtering
      await get().fetchPayments(get().currentUser || details.userName);
      toastMessage("success", "Paiement soumis avec succès.");
    } catch (error) {
      throw error;
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [serviceId]: false },
      }));
    }
  },
  uploadPaymentProof: async (paymentId, file) => {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [paymentId]: true },
    }));

    try {
      const formData = new FormData();
      formData.append("proof", file);

      const response = await fetch(`/api/payments/proof/${paymentId}`, {
        method: "PUT",
        body: formData,
        // Add headers to ensure proper handling
        headers: {
          // Remove Content-Type header to let browser set it with boundary
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update proof");
      }

      // Refresh payments to get updated data
      await get().fetchPayments(get().currentUser!);
    } catch (error) {
      console.error("Error updating proof:", error);
      throw error;
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },
  verifyPayment: async (paymentId) => {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [paymentId]: true },
    }));

    try {
      const payment = get().payments.find((p) => p._id === paymentId);
      if (!payment) {
        throw new Error("Payment not found");
      }

      if (!payment.service?.modifiedFile) {
        throw new Error(
          "Le fichier modifié doit être téléchargé avant de vérifier le paiement."
        );
      }

      const response = await fetch(`/api/payments/verify/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "VERIFIED" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la vérification");
      }

      await get().fetchPayments(get().currentUser!);
      toastMessage("success", "Paiement vérifié avec succès");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de la vérification";
      toastMessage("error", message);
      throw error;
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },
  fetchPayments: async (username?: string) => {
    set({ loading: true });
    try {
      const url = username ? `/api/payments/user/${username}` : "/api/payments";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      if (!data.payments) {
        throw new Error("Invalid response format");
      }

      set({ payments: data.payments, loading: false });
    } catch (error) {
      console.error("Fetch payments error:", error);
      set({ error: "Failed to fetch payments", loading: false });
      toastMessage("error", "Erreur lors du chargement des paiements");
    }
  },

  downloadPaymentProof: (proof: PaymentProof) => {
    if (!proof.file?.data) {
      toastMessage("error", "Fichier non disponible");
      return;
    }

    // Fix Buffer issue
    const arrayBuffer =
      typeof proof.file.data === "string"
        ? Buffer.from(proof.file.data, "base64").buffer
        : //@ts-expect-error later
          proof.file.data.buffer;

    const blob = new Blob([arrayBuffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = proof.file.name || "payment-proof";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  rejectPayment: async (paymentId) => {
    set((state) => ({
      loading: true,
      serviceLoading: { ...state.serviceLoading, [paymentId]: true },
    }));

    try {
      const response = await fetch(`/api/payments/verify/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "FAILED" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du rejet du paiement");
      }

      await get().fetchPayments(get().currentUser!);
      toastMessage("success", "Paiement rejeté avec succès");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors du rejet du paiement";
      toastMessage("error", message);
      throw error;
    } finally {
      set((state) => ({
        loading: false,
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },
  retryPayment: async (paymentId: string, file: File) => {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [paymentId]: true },
    }));

    try {
      const formData = new FormData();
      formData.append("proof", file);

      const response = await fetch(`/api/payments/proof/${paymentId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update proof");
      }

      await get().fetchPayments(get().currentUser!);
      toastMessage(
        "success",
        "Nouvelle preuve de paiement envoyée avec succès, Le paiement est en attente."
      );
      return response.json();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors du téléchargement de la nouvelle preuve";
      toastMessage("error", message);
      throw error;
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },
}));
