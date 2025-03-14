import { create } from "zustand";
import { PaymentMethod, Payment, PaymentProof } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";

const PAYMENT_API_BASE_URL = "/api/payments";

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
  verifyPayment: (paymentId: string) => Promise<void>;
  fetchPayments: (username?: string) => Promise<void>;
  downloadPaymentProof: (proof: PaymentProof) => void;
  rejectPayment: (paymentId: string) => Promise<void>;
  setCurrentUser: (username: string) => void;
}

const handleError = (error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  toastMessage("error", message);
  throw new Error(message);
};

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
      const file = details.proofFile;
      if (!file) throw new Error("Proof file is required");

      const formData = new FormData();
      formData.append("serviceId", serviceId);
      formData.append("proof", details.proofFile!);
      formData.append("method", details.method);
      formData.append("amount", details.amount.toString());
      formData.append("userName", details.userName);

      const response = await fetch(`${PAYMENT_API_BASE_URL}/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Échec de la soumission du paiement");
      }

      await get().fetchPayments(details.userName);
      toastMessage("success", "Paiement soumis avec succès.");
    } catch (error) {
      handleError(error, "Erreur lors de la soumission du paiement");
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
      const { currentUser, payments } = get();
      const payment = payments.find((p) => p._id === paymentId);
      const userIdentifier = currentUser || payment?.userName;

      if (!userIdentifier) {
        throw new Error("Session expirée, veuillez vous reconnecter");
      }

      const formData = new FormData();
      formData.append("proof", file);

      const response = await fetch(
        `${PAYMENT_API_BASE_URL}/proof/${paymentId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la mise à jour de la preuve"
        );
      }

      await get().fetchPayments(userIdentifier);
      toastMessage("success", "Preuve de paiement mise à jour avec succès");
    } catch (error) {
      handleError(error, "Erreur lors de la mise à jour de la preuve");
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
        throw new Error("Paiement introuvable");
      }
      console.log("in veryify payment", payment);
      if (!payment.service?.modifiedFile) {
        throw new Error(
          "Le fichier modifié doit être téléchargé avant de vérifier le paiement."
        );
      }

      const response = await fetch(
        `${PAYMENT_API_BASE_URL}/verify/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "VERIFIED" }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la vérification");
      }

      await get().fetchPayments(get().currentUser!);
      toastMessage("success", "Paiement vérifié avec succès");
    } catch (error) {
      handleError(error, "Erreur lors de la vérification");
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },

  fetchPayments: async (username?: string) => {
    const currentPayments = get().payments;
    const isInitialLoad = currentPayments.length === 0;

    if (isInitialLoad) {
      set({ loading: true });
    }

    try {
      const url = username
        ? `${PAYMENT_API_BASE_URL}/${username}`
        : PAYMENT_API_BASE_URL;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Échec du chargement des paiements");
      }

      const data = await response.json();
      set({ payments: data.payments });
    } catch (error) {
      handleError(error, "Erreur lors du chargement des paiements");
    } finally {
      if (isInitialLoad) {
        set({ loading: false });
      }
    }
  },
  downloadPaymentProof: (proof: PaymentProof) => {
    if (!proof.file?.data) {
      toastMessage("error", "Fichier non disponible");
      return;
    }

    const arrayBuffer =
      typeof proof.file.data === "string"
        ? Buffer.from(proof.file.data, "base64").buffer
        : // @ts-expect-error fix later
          proof.file.data.buffer;

    const blob = new Blob([arrayBuffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = proof.file.name || "preuve-de-paiement";
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
      const response = await fetch(
        `${PAYMENT_API_BASE_URL}/verify/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "FAILED" }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du rejet du paiement");
      }

      await get().fetchPayments(get().currentUser!);
      toastMessage("success", "Paiement rejeté avec succès");
    } catch (error) {
      handleError(error, "Erreur lors du rejet du paiement");
    } finally {
      set((state) => ({
        loading: false,
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  },
}));
