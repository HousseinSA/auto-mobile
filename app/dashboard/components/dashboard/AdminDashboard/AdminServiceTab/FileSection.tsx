import { useState } from "react"
import { Download, Upload, FileText, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/types/ServiceTypes"
import { cn } from "@/lib/utils/utils"
import { shortenFileName } from "@/lib/utils/fileUtils"
import toastMessage from "@/lib/globals/ToastMessage"

interface FileSectionProps {
  service: Service
}

export function FileSection({ service }: FileSectionProps) {
  const [uploading, setUploading] = useState(false)

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
      toastMessage("error", "Échec du téléchargement du fichier")
    }
  }

  const handleModifiedDownload = () => {
    try {
      // @ts-expect-error fix
      const binaryData = atob(service.modifiedFile.data)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: "application/octet-stream" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      // @ts-expect-error fix
      link.download = service?.modifiedFile?.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toastMessage("error", "Échec du téléchargement du fichier modifié")
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toastMessage("error", "La taille du fichier doit être inférieure à 5MB")
      event.target.value = ""
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(
        `/api/services/uploadModified/${service._id}`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      toastMessage("success", "Fichier téléversé avec succès")
      window.location.reload()
    } catch (error) {
      console.error("Upload error:", error)
      toastMessage("error", "Échec du téléversement du fichier")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      {service.stockFile && (
        <div
          className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 w-full sm:w-auto hover:bg-gray-100 cursor-pointer"
          onClick={handleDownload}
          title="Télécharger le fichier original"
        >
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm truncate flex-1">
            {shortenFileName(service.stockFile.name)}
          </span>
          <Download className="h-4 w-4 text-primary shrink-0" />
        </div>
      )}

      {service.modifiedFile && (
        <div
          className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 w-full sm:w-auto hover:bg-gray-100 cursor-pointer"
          onClick={handleModifiedDownload}
          title="Télécharger le fichier modifié"
        >
          <FileText className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-sm truncate flex-1">
            {shortenFileName(service.modifiedFile.name)}
          </span>
          <Download className="h-4 w-4 text-green-600 shrink-0" />
        </div>
      )}

      <div className="w-full sm:w-auto">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".bin"
          className="hidden"
          id={`modified-file-${service._id}`}
          disabled={uploading}
        />
        <Label
          htmlFor={`modified-file-${service._id}`}
          className={cn(
            "flex items-center justify-center gap-2 cursor-pointer p-3 w-full sm:w-auto",
            "border-2 border-dashed rounded-lg",
            "hover:bg-gray-50 transition-colors",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 text-gray-500" />
          )}
          <span className="text-sm whitespace-nowrap">
            {uploading ? "Téléversement..." : "Téléverser le fichier modifié"}
          </span>
        </Label>
      </div>
    </div>
  )
}
