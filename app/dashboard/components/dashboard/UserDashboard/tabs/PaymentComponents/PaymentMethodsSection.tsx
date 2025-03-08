import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentMethod } from "@/lib/types/PaymentTypes"
import { paymentMethods } from "@/lib/constants/paymentMethods"

interface PaymentMethodsSectionProps {
  selectedMethod: PaymentMethod
  onMethodSelect: (method: PaymentMethod) => void
  copiedField: string | null
  onCopy: (text: string) => void
}

export function PaymentMethodsSection({
  selectedMethod,
  onMethodSelect,
  copiedField,
  onCopy,
}: PaymentMethodsSectionProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(paymentMethods).map(([key, method]) => (
          <Button
            key={key}
            variant={selectedMethod === key ? "default" : "outline"}
            onClick={() => onMethodSelect(key as PaymentMethod)}
            className="flex items-center gap-2"
          >
            <span>{method.icon}</span>
            <span>{method.label}</span>
          </Button>
        ))}
      </div>

      <div className="bg-white p-3 rounded">
        <p className="text-sm font-medium mb-1">
          {paymentMethods[selectedMethod].label}:
        </p>
        <div className="flex items-center gap-2">
          <code className="bg-gray-50 px-2 py-1 rounded text-sm flex-1">
            {paymentMethods[selectedMethod].value}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(paymentMethods[selectedMethod].value)}
            className="shrink-0"
          >
            {copiedField === paymentMethods[selectedMethod].value ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}