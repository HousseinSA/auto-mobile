import { useState } from "react"
import { Upload, FileText, Loader2, X, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/types/ServiceTypes"
import { cn } from "@/lib/utils/utils"
import { shortenFileName } from "@/lib/utils/fileUtils"
import { useAdminStore } from "@/store/AdminStore"
import { ConfirmModal } from "@/lib/globals/confirm-modal"

interface FileSectionProps {
  service: Service
}

export function FileSection({ service }: FileSectionProps) {
  const {
    uploadModifiedFile,
    downloadFile,
    removeModifiedFile,
    fileUploadLoading,
  } = useAdminStore()
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadModifiedFile(service._id, file)
    event.target.value = ""
  }

  const handleRemoveFile = async () => {
    setIsRemoving(true)
    await removeModifiedFile(service._id)
    setShowRemoveDialog(false)
    setIsRemoving(false)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        {service.stockFile && (
          <div
            className="flex items-center justify-between gap-2 p-2 border rounded-lg bg-gray-50 w-full sm:w-auto hover:bg-gray-100 cursor-pointer group"
            onClick={() => downloadFile(service.stockFile!)}
          >
            <div className="flex items-center gap-2 flex-1">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm truncate">
                {shortenFileName(service.stockFile.name)}
              </span>
            </div>
            <Download
              className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                downloadFile(service.stockFile!)
              }}
            />
          </div>
        )}

        {service.modifiedFile ? (
          <div
            className={cn(
              "flex items-center justify-between gap-2 p-2 border rounded-lg bg-gray-50 w-full sm:w-auto",
              "hover:bg-gray-100 cursor-pointer group",
              isRemoving && "pointer-events-none opacity-50"
            )}
            onClick={() =>
              !isRemoving && downloadFile(service.modifiedFile!, true)
            }
          >
            <div className="flex items-center gap-2 flex-1">
              <FileText className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-sm truncate">
                {shortenFileName(service.modifiedFile.name)}
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
              ) : (
                <>
                  <Download
                    className="h-4 w-4 text-green-600 hover:text-green-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadFile(service.modifiedFile!, true)
                    }}
                  />
                  <X
                    className="h-4 w-4 text-red-600 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowRemoveDialog(true)
                    }}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full sm:w-auto">
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".bin"
              className="hidden"
              id={`modified-file-${service._id}`}
              disabled={fileUploadLoading[service._id]}
            />
            <Label
              htmlFor={`modified-file-${service._id}`}
              className={cn(
                "flex items-center justify-center gap-2 cursor-pointer p-3 w-full sm:w-auto",
                "border-2 border-dashed rounded-lg",
                "hover:bg-gray-50 transition-colors",
                fileUploadLoading[service._id] &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {fileUploadLoading[service._id] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm whitespace-nowrap">
                {fileUploadLoading[service._id]
                  ? "Téléversement..."
                  : "Téléverser le fichier modifié"}
              </span>
            </Label>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showRemoveDialog}
        onConfirm={handleRemoveFile}
        onCancel={() => setShowRemoveDialog(false)}
        title="Supprimer le fichier modifié"
        description="Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action ne peut pas être annulée."
        isLoading={isRemoving}
      />
    </>
  )
}
