import { useState, useEffect } from 'react'
import { usePaymentStore } from '@/store/PaymentStore'
import { PaymentProof } from '@/lib/types/PaymentTypes'

export const useAdminPayments = () => {
  const {
    payments,
    verifyPayment: storeVerifyPayment,
    rejectPayment: storeRejectPayment,
    fetchPayments,
    loading,
    viewPaymentProof,
  } = usePaymentStore()

  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [selectedProof, setSelectedProof] = useState<{
    data: string
    name: string
  } | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const pendingPayments = payments.filter((p) => p.status === "PENDING")
  const verifiedPayments = payments.filter((p) => p.status === "VERIFIED")
  const failedPayments = payments.filter((p) => p.status === "FAILED")

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleVerify = (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    setShowVerifyModal(true)
  }

  const handleReject = (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    setShowRejectModal(true)
  }

  const handleViewProof = (proof: PaymentProof) => {
    const proofData = viewPaymentProof(proof)
    if (proofData) {
      setSelectedProof(proofData)
    }
  }



  const handleConfirmVerify = async () => {
    if (!selectedPaymentId) return
    setVerifyingId(selectedPaymentId)
    try {
      await storeVerifyPayment(selectedPaymentId)
      setShowVerifyModal(false)
      await fetchPayments() // Refresh to update tabs
    } finally {
      setVerifyingId(null)
      setSelectedPaymentId(null)
    }
  }

  const handleConfirmReject = async () => {
    if (!selectedPaymentId) return
    setVerifyingId(selectedPaymentId)
    try {
      await storeRejectPayment(selectedPaymentId)
      setShowRejectModal(false)
      await fetchPayments() // Refresh to update tabs
    } finally {
      setVerifyingId(null)
      setSelectedPaymentId(null)
    }
  }

  return {
    loading,
    pendingPayments,
    verifiedPayments,
    failedPayments,
    verifyingId,
    selectedProof,
    showVerifyModal,
    showRejectModal,
    selectedPaymentId,
    currentPage,
    setCurrentPage,
    handleVerify,
    handleReject,
    handleViewProof,
    setSelectedProof,
    setShowVerifyModal,
    setShowRejectModal,
    
    handleConfirmVerify,
    handleConfirmReject
  }
}