import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PaymentList } from "./PaymentList";
import { Payment } from "@/lib/types/PaymentTypes";
import { Loader2 } from "lucide-react";
import TabTrigger from "@/lib/utils/TabTrigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { ScrollableTabContent } from "@/lib/utils/ScrollableContent";

interface PaymentTabsProps {
  pendingPayments: Payment[];
  verifiedPayments: Payment[];
  failedPayments: Payment[];
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
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
  const [activeTab, setActiveTab] = useState("pending");

  // Memoize tabs data
  const tabs = useMemo(
    () => [
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
    ],
    [pendingPayments, verifiedPayments, failedPayments]
  );

  // Don't show loading state if we already have data
  const showLoading =
    loading &&
    !pendingPayments.length &&
    !verifiedPayments.length &&
    !failedPayments.length;

  const header = (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary">
        Gestion des Paiements
      </h2>

      {/* Mobile Select */}
      <div className="block md:hidden">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {tabs.find((tab) => tab.value === activeTab)?.label}(
              {tabs.find((tab) => tab.value === activeTab)?.count})
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-between"
              >
                <span>{tab.label}</span>
                <span className="text-muted-foreground">({tab.count})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block w-full">
        <div className="flex w-full rounded-lg bg-muted/20 p-1">
          {tabs.map((tab) => (
            <TabTrigger
              key={tab.value}
              value={tab.value}
              isActive={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label} ({tab.count})
            </TabTrigger>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ScrollableTabContent header={header}>
      {showLoading ? (
        <div className="h-[400px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs value={activeTab} className="w-full">
          {tabs.map((tab) => (
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
          ))}
        </Tabs>
      )}
    </ScrollableTabContent>
  );
}
