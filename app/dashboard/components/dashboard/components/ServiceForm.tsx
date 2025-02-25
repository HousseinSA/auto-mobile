import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, Loader2, Pencil } from "lucide-react"
import {
  Service,
} from "@/lib/types/ServiceTypes"
import { useFormStore } from "@/store/FormStore"

interface ServiceFormProps {
  username: string
  showForm: boolean
  editingService: Service | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  onAddClick: () => void
}

export function ServiceForm({
  showForm,
  editingService,
  isSubmitting,
  onSubmit,
  onCancel,
  onAddClick,
}: ServiceFormProps) {
  const form = useFormStore()

  return (
    <div className="px-4 py-2 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold text-primary">
          Ajouter un nouveau service
        </h3>
        {!showForm && (
          <Button
            onClick={onAddClick}
            className="bg-primary text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un service
          </Button>
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-visible ${
          showForm ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Label>Type de carburant</Label>
              <Select
                value={form.fuelType}
                onValueChange={form.handleFuelTypeChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent
                  className="min-w-[200px]"
                  position="popper"
                  sideOffset={5}
                >
                  <SelectItem value="Essence">Essence</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.fuelType && (
              <div>
                <Label>Type d&apos;ECU</Label>
                <Select
                  value={form.ecuType}
                  onValueChange={form.handleEcuTypeChange}
                >
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
          </div>

          {form.ecuType && (
            <div>
              <Label htmlFor="ecuNumber">Numéro ECU</Label>
              <div className="flex gap-2 mt-1">
                {form.fuelType === "Diesel" && form.ecuType === "Bosch" ? (
                  <Input
                    id="boschNumber"
                    value={form.boschNumber}
                    onChange={form.handleBoschNumberChange}
                    placeholder="EDC17C01"
                    required
                    className="flex-1"
                  />
                ) : (
                  <div className="flex-1 flex">
                    <Input
                      value="89663-"
                      disabled
                      className="w-[4.5rem] rounded-r-none border-r-0"
                    />
                    <Input
                      id="ecuNumber"
                      value={form.ecuNumber}
                      onChange={form.handleEcuNumberChange}
                      maxLength={10}
                      minLength={5}
                      placeholder="60R51"
                      required
                      className="flex-1 rounded-l-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Options de service</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(form.serviceOptions).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    className="text-white"
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      form.setServiceOptions((prev) => ({
                        ...prev,
                        [key]: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor={key}>{key}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !form.fuelType ||
                !form.ecuType ||
                !form.getFullEcuNumber()
              }
              className="flex items-center gap-2 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : editingService ? (
                <>
                  <Pencil className="h-4 w-4" />
                  Mettre a jour le service
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Ajouter le service
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
