import { Download, Upload, FileText } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/types/ServiceTypes"
import { cn } from "@/lib/utils/utils"
import { shortenFileName } from "@/lib/utils/fileUtils"

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
  }

  const handleDownload = () => {
    try {
      // @ts-expect-error fix
      const binaryData = atob(service.stockFile.data)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: "application/octet-stream" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      // @ts-expect-error fix
      link.download = service?.stockFile?.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      // Toast("Failed to download file")
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      {service.stockFile && (
        <div
          className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 w-full sm:w-auto hover:bg-gray-100 cursor-pointer"
          onClick={handleDownload}
          title="Télécharger le fichier"
        >
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm truncate flex-1">
            {shortenFileName(service.stockFile.name)}
          </span>
          <Download className="h-4 w-4 text-primary shrink-0" />
        </div>
      )}

      <div className="w-full sm:w-auto">
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
            "flex items-center justify-center gap-2 cursor-pointer p-3 w-full sm:w-auto",
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
