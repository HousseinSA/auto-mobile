import { Download, Eye, FileText } from "lucide-react"
import { useState } from "react"
import { useServiceStore } from "@/store/ServiceStore"
import { usePaymentStore } from "@/store/PaymentStore"
import { PaymentMethod, PaymentProof } from "@/lib/types/PaymentTypes"
import { Button } from "@/components/ui/button"
import toastMessage from "@/lib/globals/ToastMessage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils/utils"
import { ConfirmModal } from "@/lib/globals/confirm-modal"
import { ServiceOptions } from "../ServiceList/ServiceOptions"
import { ServicePaymentCard } from "./PaymentComponents/ServicePaymentCard"
import { PaymentMethodsSection } from "./PaymentComponents/PaymentMethodsSection"
import NoPaymentResults from "@/shared/NoPaymentResults"

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

  // Service filters updated to use payments data
  const unpaidServices = services.filter(
    (service) => !payments.some(p => p.serviceId === service._id)
  )

  const pendingPayments = services.filter(
    (service) => payments.some(p => 
      p.serviceId === service._id && 
      p.status === "PENDING"
    )
  )

  const completedPayments = services.filter(
    (service) => payments.some(p => 
      p.serviceId === service._id && 
      p.status === "VERIFIED"
    )
  )

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
      const formData = new FormData()
      formData.append("serviceId", selectedServiceId)
      formData.append("proof", proofFile)
      formData.append("method", selectedMethod)
      formData.append("amount", selectedService.totalPrice.toString())
  
      await submitPayment(selectedServiceId, {
        method: selectedMethod,
        amount: selectedService.totalPrice,
        proofFile: proofFile
      })
  
      setPaymentProofs((prev) => {
        const newProofs = { ...prev }
        delete newProofs[selectedServiceId]
        return newProofs
      })
      setShowConfirmModal(false)
    } catch (error) {
      toastMessage("error", "Erreur lors de la soumission du paiement")
    }
  }

  const downloadProof = (url: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const viewProof = (proof: PaymentProof) => {
    if (proof.file.data) {
      const base64Data =
        proof.file.data instanceof Buffer
          ? proof.file.data.toString("base64")
          : Buffer.from(proof.file.data.buffer).toString("base64")

      window.open(`data:image/png;base64,${base64Data}`, "_blank")
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
            Vérifiés ({completedPayments.length})
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
              {pendingPayments.map((service) => (
                <div
                  key={service._id}
                  className="border p-4 rounded-lg bg-yellow-50"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Service #{service._id.slice(-6)}
                        </p>
                        <p className="text-sm text-amber-600">
                          En attente de vérification
                        </p>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary ">ECU:</span>{" "}
                            {service.ecuType}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary"> Numéro de software:</span>{" "}
                            {service.ecuNumber}
                          </p>
                          <p className="text-sm text-gray">
                            <span className="font-medium text-primary">Carburant:</span>{" "}
                            {service.fuelType}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Génération:</span>{" "}
                            {service.generation}
                          </p>
                        </div>
                        <ServiceOptions serviceOptions={service.serviceOptions} />
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Méthode:</span>{" "}
                            {service.payment?.methode}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Montant:</span>{" "}
                            {service.payment?.montant}€
                          </p>
                        </div>
                      </div>
                      {service.payment?.proof && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {service.payment.proof.file.name}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewProof(service.payment.proof)}
                            className="text-primary"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadProof(service.payment.proof)}
                            className="text-primary"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedPayments.length === 0 ? (
            <NoPaymentResults type="no-verified" isAdmin={false} />
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary mb-4">
                Paiements vérifiés
              </h3>
              {completedPayments.map((service) => (
                <div
                  key={service._id}
                  className="border p-4 rounded-lg bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Service #{service._id.slice(-6)}
                      </p>
                      <p className="text-sm text-green-600">Paiement vérifié</p>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ECU:</span>{" "}
                          {service.ecuType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">N° ECU:</span>{" "}
                          {service.ecuNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Carburant:</span>{" "}
                          {service.fuelType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Génération:</span>{" "}
                          {service.generation}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Méthode:</span>{" "}
                          {service.payment?.methode}
                        </p>
                      </div>
                      <ServiceOptions serviceOptions={service.serviceOptions} />
                    </div>
                    {service.payment?.proof && (
                      <Button
                        variant="outline"
                        onClick={() => viewProof(service.payment.proof)}
                        className="text-primary"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir la preuve
                      </Button>
                    )}
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
