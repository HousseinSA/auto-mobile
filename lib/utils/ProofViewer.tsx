import { PaymentProof } from "@/lib/types/PaymentTypes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Eye, Upload } from "lucide-react"
import { downloadProofFile } from "@/lib/utils/downloadUtils"
import { useState } from "react"
import Image from "next/image"
import toastMessage from "@/lib/globals/ToastMessage"

interface ProofViewerProps {
  proof?: PaymentProof
  isAdmin?: boolean
  onProofChange?: (file: File) => Promise<void>
  serviceId: string
}

export function ProofViewer({ 
  proof, 
  isAdmin = false, 
  onProofChange,
  // serviceId 
}: ProofViewerProps) {
  const [showProof, setShowProof] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toastMessage("error", "File must not exceed 5MB")
      return
    }

    setLoading(true)
    try {
      await onProofChange?.(file)
      toastMessage("success", "Payment proof updated successfully")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toastMessage("error", "Error updating proof")
    } finally {
      setLoading(false)
    }
  }

  const getProofData = (proof: PaymentProof) => {
    if (!proof?.file?.data) return null

    try {
      let base64Data: string
      const fileData = proof.file.data

      if (typeof fileData === "string") {
        base64Data = fileData.includes("base64,") 
          ? fileData 
          : `data:${proof.file.contentType || "image/png"};base64,${fileData}`
      } else if (fileData instanceof Buffer) {
        base64Data = `data:${proof.file.contentType || "image/png"};base64,${fileData.toString("base64")}`
      } else if (fileData instanceof ArrayBuffer) {
        base64Data = `data:${proof.file.contentType || "image/png"};base64,${Buffer.from(fileData).toString("base64")}`
      } else {
        base64Data = `data:${proof.file.contentType || "image/png"};base64,${Buffer.from(fileData.buffer).toString("base64")}`
      }

      return base64Data
    } catch (error) {
      console.error("Error processing proof:", error)
      return null
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {proof && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProof(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View proof
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadProofFile(proof)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </>
        )}
        {!isAdmin && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
                {proof ? 'Change proof' : 'Upload proof'}
              </span>
            </Button>
          </label>
        )}
      </div>

      <Dialog open={showProof} onOpenChange={setShowProof}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          {proof && (
            <div className="relative w-full aspect-video">
              <Image
                src={getProofData(proof) || ''}
                alt="Payment proof"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}