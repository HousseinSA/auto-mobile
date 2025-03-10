import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PaymentList } from "./PaymentList"
import { Payment } from "@/lib/types/PaymentTypes"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface PaymentTabsProps {
  pendingPayments: Payment[]
  verifiedPayments: Payment[]
  failedPayments: Payment[]
  onVerify: (id: string) => void
  onReject: (id: string) => void
  loading: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
}

export function PaymentTabs({
  pendingPayments,
  verifiedPayments,
  failedPayments,
  onVerify,
  onReject,
  loading,
  currentPage,
  setCurrentPage,
}: PaymentTabsProps) {
  const tabs = [
    {
      value: "pending",
      label: "En attente",
      count: pendingPayments.length,
      content: pendingPayments,
    },
    {
      value: "verified",
      label: "Vérifiés",
      count: verifiedPayments.length,
      content: verifiedPayments,
    },
    {
      value: "failed",
      label: "Rejetés",
      count: failedPayments.length,
      content: failedPayments,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">Gestion des Paiements</h2>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "text-primary",
                "data-[state=active]:bg-primary",
                "data-[state=active]:text-white"
              )}
            >
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {loading ? (
          <div className="h-[400px] w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <PaymentList
                payments={tab.content}
                status={tab.value}
                onVerify={onVerify}
                onReject={onReject}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  )
}