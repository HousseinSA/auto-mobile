import { PaymentProof } from "../types/PaymentTypes"
import toastMessage from "../globals/ToastMessage"

export const downloadProofFile = (proof: PaymentProof) => {
  if (!proof.file?.data) {
    toastMessage("error", "Fichier non disponible")
    return
  }

  try {
    const arrayBuffer =
      typeof proof.file.data === "string"
        ? Buffer.from(proof.file.data, "base64").buffer
        : proof.file.data instanceof Buffer
        ? proof.file.data.buffer
        : proof.file.data instanceof ArrayBuffer
        ? proof.file.data
        : proof.file.data.buffer

    const blob = new Blob([arrayBuffer], {
      type: proof.file.contentType || "application/octet-stream"
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = proof.file.name || "payment-proof"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toastMessage("success", "Téléchargement commencé")
  } catch (error) {
    console.error("Download error:", error)
    toastMessage("error", "Erreur lors du téléchargement")
  }
}