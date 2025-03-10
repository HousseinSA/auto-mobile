import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/lib/types/PaymentTypes";
import { paymentMethods } from "@/lib/constants/paymentMethods";

interface PaymentMethodsSectionProps {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
  copiedField: string | null;
  onCopy: (text: string) => void;
}

export function PaymentMethodsSection({
  selectedMethod , 
  onMethodSelect,
  copiedField,
  onCopy,
}: PaymentMethodsSectionProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="mb-4">
        <Select
          defaultValue="BANKILY" 
          value={selectedMethod}  
          onValueChange={(value) => onMethodSelect(value as PaymentMethod)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(paymentMethods).map(([key, method]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  {method.icon} {method.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-3 rounded">
        <p className="text-md font-medium mb-1 text-primary ">
          {paymentMethods[selectedMethod].label}:
        </p>
        <div className="flex items-center gap-2">
          <code className="bg-gray-50 px-2 py-1 rounded text-md  flex-1">
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
  );
}
