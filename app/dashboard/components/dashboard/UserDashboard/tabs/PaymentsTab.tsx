/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react"
import { useServiceStore } from "@/store/ServiceStore"
import { usePaymentStore } from "@/store/PaymentStore"
import { PaymentMethod, PaymentProof } from "@/lib/types/PaymentTypes"
import toastMessage from "@/lib/globals/ToastMessage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils/utils"
import { ConfirmModal } from "@/lib/globals/confirm-modal"
import { ServiceOptions } from "../ServiceList/ServiceOptions"
import { ServicePaymentCard } from "./PaymentComponents/ServicePaymentCard"
import { PaymentMethodsSection } from "./PaymentComponents/PaymentMethodsSection"
import NoPaymentResults from "@/shared/NoPaymentResults"
import { dateFormat } from "@/lib/globals/dateFormat"

export function PaymentsTab() {
  const { services } = useServiceStore()
  const { payments, submitPayment, serviceLoading } = usePaymentStore()

  // State management - removed unused state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("PAYPAL")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentProofs, setPaymentProofs] = useState<{ [key: string]: File }>(
    {}
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  )

  const unpaidServices = services.filter(
    service => !payments.some(p => p.service?._id === service._id)
  )

  // Get pending payments with service data
  const pendingPayments = payments.filter(
    payment => payment.status === "PENDING"
  ).map(payment => ({
    _id: payment._id,
    status: payment.status,
    payment: {
      method: payment.method,
      amount: payment.amount,
      proof: payment.proof
    },
    ...payment.service // Spread service data (ecuType, ecuNumber, etc.)
  }))


  // Get verified payments with service data
  const verifiedPayments = payments.filter(
    payment => payment.status === "VERIFIED"
  ).map(payment => ({
    _id: payment._id,
    status: payment.status,
    payment: {
      method: payment.method,
      amount: payment.amount,
      proof: payment.proof
    },
    ...payment.service
  }))

  // Add useEffect to fetch payments on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        usePaymentStore.getState().fetchPayments(),
      ])
    }
    fetchInitialData()
  }, [])

  // Handlers
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(text)
    toastMessage("success", "Copié dans le presse-papiers")
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePaymentSubmit = async (serviceId: string) => {
    const proofFile = paymentProofs[serviceId]
    if (!proofFile) {
      toastMessage("error", "Veuillez d'abord ajouter une preuve de paiement")
      return
    }

    setSelectedServiceId(serviceId)
    setShowConfirmModal(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedServiceId) return

    const proofFile = paymentProofs[selectedServiceId]
    const selectedService = services.find(s => s._id === selectedServiceId)
    
    if (!selectedService) {
      toastMessage("error", "Service non trouvé")
      return
    }
  
    try {
      await submitPayment(selectedServiceId, {
        method: selectedMethod,
        amount: selectedService.totalPrice,
        proofFile: proofFile
      })

      // Clear the proof after successful submission
      setPaymentProofs((prev) => {
        const newProofs = { ...prev }
        delete newProofs[selectedServiceId]
        return newProofs
      })
      setShowConfirmModal(false)

      // Immediately fetch updated payments
      await usePaymentStore.getState().fetchPayments()
    } catch (error) {
      toastMessage("error", "Erreur lors de la soumission du paiement")
    }
  }

 
  const viewProof = (proof: PaymentProof) => {
    try {
      if (!proof?.file?.data) {
        toastMessage("error", "Aucune preuve disponible")
        return
      }
  
      let base64Data: string
      const fileData = proof.file.data
  
      // Handle different types of data
      if (typeof fileData === 'string') {
        base64Data = fileData
      } else if (fileData instanceof Buffer) {
        base64Data = fileData.toString('base64')
      } else if (fileData instanceof ArrayBuffer) {
        base64Data = Buffer.from(fileData).toString('base64')
      } else if (fileData.buffer) {
        // Handle Uint8Array or similar
        base64Data = Buffer.from(fileData.buffer).toString('base64')
      } else {
        throw new Error("Format de fichier non supporté")
      }
  
      const contentType = proof.file.contentType || 'image/png'
      window.open(`data:${contentType};base64,${base64Data}`, "_blank")
    } catch (error) {
      console.error("Error viewing proof:", error)
      toastMessage("error", "Erreur lors de l'affichage de la preuve")
    }
  }

  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">Paiements</h2>
      <Tabs defaultValue="unpaid" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
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
        </TabsList>

        <TabsContent value="unpaid">
          {unpaidServices.length === 0 ? (
            <NoPaymentResults type="no-unpaid" isAdmin={false} />
          ) : (
            <div className="space-y-4">
              <PaymentMethodsSection
                selectedMethod={selectedMethod}
                onMethodSelect={setSelectedMethod}
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <h3 className='text-primary font-medium text-lg' >Services A payer</h3>
              {unpaidServices.map((service) => (
                <ServicePaymentCard
                  key={service._id}
                  service={service}
                  paymentProof={paymentProofs[service._id]}
                  onProofSelect={(file) => {
                    if (file) {
                      setPaymentProofs((prev) => ({
                        ...prev,
                        [service._id]: file,
                      }))
                    } else {
                      setPaymentProofs((prev) => {
                        const newProofs = { ...prev }
                        delete newProofs[service._id]
                        return newProofs
                      })
                    }
                  }}
                  onSubmitPayment={() => handlePaymentSubmit(service._id)}
                  isLoading={serviceLoading[service._id]}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingPayments.length === 0 ? (
            <NoPaymentResults type="no-pending" isAdmin={false} />
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary mb-4">
                Paiements en attente
              </h3>
              {pendingPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="border p-4 rounded-lg bg-yellow-50"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Service #{payment._id.slice(-6)}
                        </p>
                        <p className="text-sm text-amber-600">
                          En attente de vérification
                        </p>
                        <div className="space-y-1 mt-2">
                        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">Carburant:</span> {payment.fuelType}
        </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary">ECU: </span>
                            {payment.ecuType}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary"> Numéro de software: </span>
                            {payment.ecuNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {/* @ts-expect-error fix later */}
                                    <span className="font-medium text-primary">Date: </span> {dateFormat(payment?.createdAt)}
                                  </p>
                        </div>
                      {/* @ts-expect-error fix later  */}
                      <ServiceOptions serviceOptions={payment.serviceOptions} />
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary">Méthode: </span>
                            {payment.payment.method}
                          </p>
                          <p className="text-sm  text-primary">
                            <span className="font-medium">Montant: </span>
                            {payment.payment.amount}€
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

<TabsContent value="completed">
  {verifiedPayments.length === 0 ? (
    <NoPaymentResults type="no-verified" isAdmin={false} />
  ) : (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary mb-4">
        Paiements vérifiés
      </h3>
      {verifiedPayments.map((payment) => (
        <div
          key={payment._id}
          className="border p-4 rounded-lg bg-green-50"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  Service #{payment._id.slice(-6)}
                </p>
                <p className="text-sm text-green-600">
                  Paiement vérifié
                </p>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Carburant:</span> {payment.fuelType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">ECU: </span>
                    {payment.ecuType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Numéro de software: </span>
                    {payment.ecuNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {/* @ts-expect-error fix later */}
                    <span className="font-medium text-primary">Date: </span> {dateFormat(payment?.createdAt)}
                  </p>
                </div>
                {/* @ts-expect-error fix later  */}
                <ServiceOptions serviceOptions={payment.serviceOptions} />
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Méthode: </span>
                    {payment.payment.method}
                  </p>
                  <p className="text-sm text-primary">
                    <span className="font-medium">Montant: </span>
                    {payment.payment.amount}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
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
  )
}
