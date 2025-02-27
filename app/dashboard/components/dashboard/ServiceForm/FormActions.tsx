import { Button } from "@/components/ui/button"
import { Service } from "@/lib/types/ServiceTypes"
import { cn } from "@/lib/utils"
import { useFormStore } from "@/store/FormStore"
import { Loader2, Pencil, Plus, X } from "lucide-react"

interface FormActionsProps {
  isSubmitting: boolean
  editingService: Service | null
  onCancel: () => void
}

export function FormActions({
  isSubmitting,
  editingService,
  onCancel,
}: FormActionsProps) {
  const form = useFormStore()
  
  const isFormValid =
    !!form.fuelType &&
    !!form.ecuType &&
    !!form.getFullEcuNumber() &&
    Object.values(form.serviceOptions).some((opt) => opt.selected)

  const handleCancel = () => {
    form.setStockFile(null)
    form.resetForm()
    onCancel()
    const fileInput = document.getElementById("stock-file") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const hasFormData =
    form.fuelType ||
    form.ecuType ||
    editingService ||
    Object.values(form.serviceOptions).some((opt) => opt.selected)

  return (
    <div className="flex gap-2">
      <Button
        type="submit"
        disabled={isSubmitting || !isFormValid}
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
      {hasFormData && (
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className={cn(
            "flex items-center gap-2",
            "transition-all duration-300",
            "animate-in slide-in-from-bottom duration-300 fade-in"
          )}
        >
          <X className="h-4 w-4" />
          Annuler
        </Button>
      )}
    </div>
  )
}
