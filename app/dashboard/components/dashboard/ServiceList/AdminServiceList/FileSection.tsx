import { Download, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/types/ServiceTypes"
import { cn } from "@/lib/utils"

interface FileSectionProps {
  service: Service
}

export function FileSection({ service }: FileSectionProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier doit être inférieure à 5MB")
      event.target.value = ""
      return
    }
    // Upload functionality will be implemented later
  }

  return (
    <div className="inline-flex items-center gap-2">
      {/* Existing File Display & Download */}
      {service.stockFile && (
        <div className="inline-flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm">{service.stockFile}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              // Download functionality will be implemented later
            }}
            title="Télécharger le fichier"
          >
            <Download className="h-4 w-4 text-primary" />
          </Button>
        </div>
      )}

      {/* Upload Section */}
      <div className="inline-flex">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".bin"
          className="hidden"
          id="modified-file"
        />
        <Label
          htmlFor="modified-file"
          className={cn(
            "inline-flex items-center gap-2 cursor-pointer p-3",
            "border-2 border-dashed rounded-lg",
            "hover:bg-gray-50 transition-colors"
          )}
        >
          <Upload className="h-4 w-4 text-gray-500" />
          <span className="text-sm whitespace-nowrap">
            Téléverser le fichier
          </span>
        </Label>
      </div>
    </div>
  )
}
