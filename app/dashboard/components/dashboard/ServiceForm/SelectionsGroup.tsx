import { Fuel, Settings } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ECUType } from "@/lib/types/ServiceTypes"
import { useFormStore } from "@/store/FormStore"
import { useCallback } from "react"

export function SelectionsGroup() {
  const form = useFormStore()

  const handleEcuTypeChange = useCallback(
    (value: ECUType) => {
      form.handleEcuTypeChange(value)
      if (value === "Delphi") {
        form.handleGenerationChange("GEN1_GEN2")
      }
    },
    [form]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Fuel Type Selection */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-gray-500" />
          <Label className="text-primary">Type de carburant</Label>
        </div>
        <Select value={form.fuelType} onValueChange={form.handleFuelTypeChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essence">Essence</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ECU Type Selection */}
      {form.fuelType && (
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <Label className="text-primary">Type d&apos;ECU</Label>
          </div>
          <Select value={form.ecuType} onValueChange={handleEcuTypeChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner l'ECU" />
            </SelectTrigger>
            <SelectContent>
              {form.fuelType === "Essence" ? (
                <>
                  <SelectItem value="Denso">Denso</SelectItem>
                  <SelectItem value="Delphi">Delphi</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Denso">Denso</SelectItem>
                  <SelectItem value="Bosch">Bosch</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Generation Selection */}
      {form.ecuType && (
        <div>
          <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <Label className="text-primary">Génération</Label>
          </div>
          <Select
            value={form.generation}
            onValueChange={form.handleGenerationChange}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner la génération" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GEN1_GEN2">GEN 1 & GEN 2</SelectItem>
              {form.ecuType !== "Delphi" && (
                <SelectItem value="GEN3_GEN4">GEN 3 & GEN 4</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
