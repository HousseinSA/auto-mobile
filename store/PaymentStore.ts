/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"
import { Payment, PaymentMethod } from "@/lib/types/PaymentTypes"
import { toast } from "react-hot-toast"

interface PaymentState {
  payments: Payment[]
  loading: boolean
  error: string | null
  
  // User actions
  submitPayment: (data: {
    serviceId: string
    amount: number
    paymentMethod: PaymentMethod
    transactionId: string
    proofImage: File
  }) => Promise<boolean>
  
  // Admin actions
  fetchPayments: (username?: string) => Promise<void>
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => Promise<boolean>
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  loading: false,
  error: null,

  submitPayment: async (data) => {
    set({ loading: true })
    try {
      const formData = new FormData()
      formData.append('serviceId', data.serviceId)
      formData.append('amount', data.amount.toString())
      formData.append('paymentMethod', data.paymentMethod)
      formData.append('transactionId', data.transactionId)
      formData.append('proofImage', data.proofImage)

      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Payment submission failed')
      }

      await get().fetchPayments()
      toast.success('Paiement soumis avec succès')
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la soumission du paiement')
      return false
    } finally {
      set({ loading: false })
    }
  },

  fetchPayments: async (username?: string) => {
    set({ loading: true })
    try {
      const url = username ? `/api/payments/user/${username}` : '/api/payments/admin'
      const response = await fetch(url)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()
      set({ payments: data.payments })
    } catch (error) {
      toast.error('Échec de la récupération des paiements')
    } finally {
      set({ loading: false })
    }
  },

  updatePaymentStatus: async (paymentId: string, status: Payment['status']) => {
    set({ loading: true })
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      await get().fetchPayments()
      toast.success('Statut du paiement mis à jour')
      return true
    } catch (error) {
      toast.error('Échec de la mise à jour du statut')
      return false
    } finally {
      set({ loading: false })
    }
  }
}))