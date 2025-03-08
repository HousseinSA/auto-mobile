import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/utils"
import { Upload, X } from "lucide-react"

interface PaymentProofUploadProps {
  file: File | null
  onFileSelect: (file: File | null) => void
  serviceId: string
}

export function PaymentProofUpload({
  file,
  onFileSelect,
  serviceId,
}: PaymentProofUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("La taille du fichier doit être inférieure à 5MB")
      event.target.value = ""
      return
    }
    onFileSelect(selectedFile)
  }

  return (
    <div>
      <Input
        type="file"
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        className="hidden"
        id={`proof-${serviceId}`}
      />
      <Label
        htmlFor={`proof-${serviceId}`}
        className={cn(
          "flex items-center gap-2 cursor-pointer p-3",
          "border-2 border-dashed rounded-lg",
          "hover:bg-gray-50 transition-colors",
          file && "border-primary text-primary"
        )}
      >
        <Upload className="h-5 w-5" />
        <span className="flex-1">
          {file ? file.name : "Ajouter preuve de paiement"}
        </span>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFileSelect(null)
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Label>
    </div>
  )
}
