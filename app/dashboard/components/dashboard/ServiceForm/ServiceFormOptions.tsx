import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils/utils"
import { useFormStore } from "@/store/FormStore"
import { useCallback } from "react"

export function ServiceFormOptions() {
  const form = useFormStore()
  const availableServices = form.getAvailableServices()

  const hasSelectedOptions = Object.values(form.serviceOptions).some(
    (opt) => opt.selected
  )

  const handleServiceOptionChange = useCallback(
    (key: string, checked: boolean) => {
      form.setServiceOption(key, checked)
    },
    [form]
  )

  const handleDtcDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setDtcDetails(e.target.value)
    },
    [form]
  )
  if (!availableServices) return null

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Object.entries(availableServices.options).map(([key, option]) => {
          const isChecked = form.serviceOptions[key]?.selected || false
          const isDtcOff = key === "DTC_OFF"

          return (
            <div key={key}>
              <div
                className={cn(
                  "flex items-center justify-between p-3 border rounded-lg",
                  "hover:bg-gray-50 transition-colors",
                  "group cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleServiceOptionChange(key, checked === true)
                    }
                    className="bg-white text-white data-[state=checked]:bg-primary"
                  />
                  <span
                    className="group-hover:text-primary transition-colors"
                    onClick={() => handleServiceOptionChange(key, !isChecked)}
                  >
                    {option.label}
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  {option.price} €
                </span>
              </div>
              {isDtcOff && isChecked && (
                <div className="mt-2 ml-8">
                  <Input
                    placeholder="Détails DTC (optionnel)."
                    value={form.serviceOptions.DTC_OFF?.dtcDetails || ""}
                    onChange={handleDtcDetailsChange}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {hasSelectedOptions && (
        <div
          className={cn(
            "flex justify-end items-center gap-2 p-4 rounded-lg",
            " text-primary",
            "animate-in slide-in-from-bottom duration-300 fade-in"
          )}
        >
          <span className="text-sm font-medium">Total:</span>
          <span className="text-lg font-semibold">
            {form.calculateTotal()} €
          </span>
        </div>
      )}
    </div>
  )
}
