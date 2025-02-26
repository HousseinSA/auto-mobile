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
import { Plus, X, Loader2, Pencil, Upload } from "lucide-react"
import { Service } from "@/lib/types/ServiceTypes"
import { useFormStore } from "@/store/FormStore"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface ServiceFormProps {
  username: string
  showForm: boolean
  editingService: Service | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
}

export function ServiceForm({
  editingService,
  isSubmitting,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const form = useFormStore()
  const availableServices = form.getAvailableServices()

  const handleCancel = () => {
    form.setStockFile(null)
    onCancel()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(e)
    form.setStockFile(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".bin")) {
      alert("Veuillez sélectionner un fichier .bin")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier doit être inférieure à 5MB")
      event.target.value = ""
      return
    }

    form.setStockFile(file)
  }

  const handleServiceOptionChange = useCallback(
    (key: string, checked: boolean) => {
      form.setServiceOption(key, checked)
    },
    [form]
  )
  return (
    <div className="px-4 py-2 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold text-primary">
          {editingService ? "Modifier le service" : "Ajouter un service"}
        </h3>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fuel Type Selection */}
            <div className="relative">
              <Label className="text-primary">Type de carburant</Label>
              <Select
                value={form.fuelType}
                onValueChange={form.handleFuelTypeChange}
              >
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
                <Label className="text-primary">Type d&apos;ECU</Label>
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

            {/* Generation Selection */}
            {form.ecuType && (
              <div>
                <Label className="text-primary">Génération</Label>
                <Select
                  value={form.generation}
                  onValueChange={form.handleGenerationChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner la génération" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GEN1_GEN2">GEN 1 & GEN 2</SelectItem>
                    <SelectItem value="GEN3_GEN4">GEN 3 & GEN 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* ECU Number Input */}
          {form.ecuType && (
            <div>
              <Label htmlFor="ecuNumber" className="text-primary">
                Numéro ECU
              </Label>
              <div className="flex gap-2 mt-1">
                {form.ecuType === "Bosch" ? (
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

          {/* Service Options */}
          {availableServices && (
            <div className="mt-6">
              {/* <Label className="text-md font-semibold text-primary">
                {availableServices.title}
              </Label> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {Object.entries(availableServices.options).map(
                  ([key, option]) => (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-lg",
                        "hover:bg-gray-50 transition-colors",
                        "group cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={form.serviceOptions[key]?.selected || false}
                          onCheckedChange={(checked) =>
                            handleServiceOptionChange(key, checked === true)
                          }
                          className="bg-white text-white data-[state=checked]:bg-primary"
                        />
                        <span className=" group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                      </div>
                      <span className="font-semibold text-primary">
                        {option.price} €
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Label className="text-primary">Fichier Stock (optionnel)</Label>
            <div className="mt-2">
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".bin"
                className="hidden"
                id="stock-file"
              />
              <Label
                htmlFor="stock-file"
                className={cn(
                  "flex items-center gap-2 cursor-pointer p-3",
                  "border-2 border-dashed rounded-lg",
                  "hover:bg-gray-50 transition-colors",
                  form.stockFile && "border-primary text-primary"
                )}
              >
                <Upload className="h-5 w-5" />
                <span className="flex-1">
                  {form.stockFile
                    ? form.stockFile.name
                    : "Choisir un fichier stock (.bin)"}
                </span>
                {form.stockFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      form.setStockFile(null)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Label>
            </div>
          </div>

          {/* Total Section - Only show when there are selected options */}
          {Object.values(form.serviceOptions).some((opt) => opt.selected) && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Total:</span>{" "}
                <span className="text-md font-semibold text-primary">
                  {form.calculateTotal()} €
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !form.fuelType ||
                !form.ecuType ||
                !form.getFullEcuNumber() ||
                !Object.values(form.serviceOptions).some((opt) => opt.selected) // Add this line
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
              onClick={handleCancel}
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
