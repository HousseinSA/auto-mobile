import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useFormStore } from "@/store/FormStore"
import { useCallback } from "react"

export function ServiceOptions() {
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

  const toggleServiceOption = (key: string) => {
    const current = form.serviceOptions[key]?.selected || false
    form.setServiceOption(key, !current)
  }

  if (!availableServices) return null

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Object.entries(availableServices.options).map(([key, option]) => (
          <div
            key={key}
            onClick={() => toggleServiceOption(key)}
            className={cn(
              "flex items-center justify-between p-3 border rounded-lg",
              "hover:bg-gray-50 transition-colors",
              "group cursor-pointer"
            )}
          >
            <div
              className="flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={form.serviceOptions[key]?.selected || false}
                onCheckedChange={(checked) =>
                  handleServiceOptionChange(key, checked === true)
                }
                className="bg-white text-white data-[state=checked]:bg-primary"
              />
              <span className="group-hover:text-primary transition-colors">
                {option.label}
              </span>
            </div>
            <span className="font-semibold text-primary">{option.price} €</span>
          </div>
        ))}
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
