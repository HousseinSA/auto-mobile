/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { PaymentMethod, Payment, PaymentProof } from "@/lib/types/PaymentTypes"
import toastMessage from "@/lib/globals/ToastMessage"

interface PaymentStore {
  payments: Payment[]
  loading: boolean
  error: string | null
  adminPaymentDetails: {
    paypal: string
    bankily: string
  }
  serviceLoading: { [key: string]: boolean }
  submitPayment: (
    serviceId: string,
    details: {
      method: PaymentMethod
      amount: number
      proofFile?: File
    }
  ) => Promise<void>
  uploadPaymentProof: (paymentId: string, file: File) => Promise<void>
  verifyPayment: (serviceId: string) => Promise<void>
  fetchPayments: (username?: string) => Promise<void>
  fetchAdminPaymentDetails: () => Promise<void>
  downloadPaymentProof: (proof: PaymentProof) => void
  viewPaymentProof: (
    proof: PaymentProof
  ) => { data: string; name: string } | null
  rejectPayment: (serviceId: string) => Promise<void>
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  loading: false,
  error: null,
  adminPaymentDetails: {
    paypal: "",
    bankily: "",
  },
  serviceLoading: {},

  submitPayment: async (serviceId, details) => {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [serviceId]: true },
    }))
    
    try {
      const formData = new FormData()
      formData.append("serviceId", serviceId)
      //@ts-expect-error later
      formData.append("proof", details.proofFile)
      formData.append("method", details.method)
      formData.append("amount", details.amount.toString())

      const response = await fetch("/api/payments/submit", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit payment")
      }

      await get().fetchPayments()
      toastMessage("success", "Payment submitted successfully")
    } catch (error) {
      throw error
    } finally {
      set((state) => ({
        serviceLoading: { ...state.serviceLoading, [serviceId]: false },
      }))
    }
  },

  uploadPaymentProof: async (paymentId, file) => {
    set(state => ({
      serviceLoading: { ...state.serviceLoading, [paymentId]: true }
    }))
  
    try {
      const formData = new FormData()
      formData.append("proof", file)
  
      const response = await fetch(`/api/payments/${paymentId}/proof`, {
        method: "PUT",
        body: formData,
        // Add headers to ensure proper handling
        headers: {
          // Remove Content-Type header to let browser set it with boundary
          'Accept': 'application/json',
        },
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update proof")
      }
  
      // Refresh payments to get updated data
      await get().fetchPayments()
    } catch (error) {
      console.error("Error updating proof:", error)
      throw error
    } finally {
      set(state => ({
        serviceLoading: { ...state.serviceLoading, [paymentId]: false }
      }))
    }
  }
,
verifyPayment: async (paymentId) => {
  set((state) => ({
    serviceLoading: { ...state.serviceLoading, [paymentId]: true },
  }));

  try {
    const payment = get().payments.find(p => p._id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.service?.modifiedFile) {
      throw new Error("Le fichier modifié doit être téléchargé avant de vérifier le paiement");
    }

    const response = await fetch(`/api/payments/verify/${paymentId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: "VERIFIED" })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la vérification");
    }

    await get().fetchPayments();
    toastMessage("success", "Paiement vérifié avec succès");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la vérification";
    toastMessage("error", message);
    throw error;
  } finally {
    set((state) => ({
      serviceLoading: { ...state.serviceLoading, [paymentId]: false },
    }));
  }
},
  fetchPayments: async (username?: string) => {
    set({ loading: true })
    try {
      const url = username 
        ? `/api/payments/user/${username}` 
        : '/api/payments'
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch payments")
      }

      const data = await response.json()
      if (!data.payments) {
        throw new Error("Invalid response format")
      }

      set({ payments: data.payments })
    } catch (error) {
      console.error("Fetch payments error:", error)
      set({ error: "Failed to fetch payments" })
      toastMessage("error", "Erreur lors du chargement des paiements")
    } finally {
      set({ loading: false })
    }
  },
  fetchAdminPaymentDetails: async () => {
    try {
      const response = await fetch("/api/payments/admin-details")
      const data = await response.json()

      if (!response.ok) throw new Error(data.message)
      set({ adminPaymentDetails: data })
    } catch (error) {
      toastMessage("error", "Erreur lors du chargement des détails de paiement")
    }
  },

  downloadPaymentProof: (proof: PaymentProof) => {
    if (!proof.file?.data) {
      toastMessage("error", "Fichier non disponible")
      return
    }

    // Fix Buffer issue
    const arrayBuffer =
      typeof proof.file.data === "string"
        ? Buffer.from(proof.file.data, "base64").buffer
              //@ts-expect-error later
        : proof.file.data.buffer

    const blob = new Blob([arrayBuffer])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = proof.file.name || "payment-proof"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
  viewPaymentProof: (proof: PaymentProof) => {
    if (!proof?.file?.data) {
      toastMessage("error", "Fichier non disponible")
      return null
    }

    try {
      let base64Data: string
      const fileData = proof.file.data

      // Convert different data types to base64
      if (typeof fileData === "string") {
        // If already base64, use as is
        base64Data = fileData.includes("base64,")
          ? fileData.split("base64,")[1]
          : fileData
      } else if (fileData instanceof Buffer) {
        base64Data = fileData.toString("base64")
      } else if (fileData instanceof ArrayBuffer) {
        base64Data = Buffer.from(fileData).toString("base64")
      } else if (fileData.buffer instanceof ArrayBuffer) {
        base64Data = Buffer.from(fileData.buffer).toString("base64")
      } else {
        throw new Error("Format de fichier non supporté")
      }

      // Use next/image for better performance in a dialog
      return {
        data: `data:${
          proof.file.contentType || "image/png"
        };base64,${base64Data}`,
        name: proof.file.name,
      }
    } catch (error) {
      console.error("Error processing proof:", error)
      toastMessage("error", "Erreur lors de l'affichage de la preuve")
      return null
    }
  },

  rejectPayment: async (paymentId) => {
    set((state) => ({
      loading: true,
      serviceLoading: { ...state.serviceLoading, [paymentId]: true },
    }))

    try {
      const response = await fetch(`/api/payments/verify/${paymentId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "FAILED" })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error rejecting payment");
      }

      await get().fetchPayments();
      toastMessage("success", "Payment rejected successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error rejecting payment";
      toastMessage("error", message);
      throw error;
    } finally {
      set((state) => ({
        loading: false,
        serviceLoading: { ...state.serviceLoading, [paymentId]: false },
      }));
    }
  }
}))
