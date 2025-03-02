import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/utils"
import { useFormStore } from "@/store/FormStore"
import { Upload, X } from "lucide-react"

export function FileUpload() {
  const form = useFormStore()

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier doit être inférieure à 5MB")
      event.target.value = ""
      return
    }

    form.setStockFile(file)
  }

  return (
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
            {form.stockFile ? form.stockFile.name : "Choisir un fichier stock"}
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
                const fileInput = document.getElementById(
                  "stock-file"
                ) as HTMLInputElement
                if (fileInput) {
                  fileInput.value = ""
                }
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Label>
      </div>
    </div>
  )
}
