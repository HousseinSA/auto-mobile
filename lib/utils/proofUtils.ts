import { PaymentProof } from "@/lib/types/PaymentTypes";
import toastMessage from "@/lib/globals/ToastMessage";

export function processProofData(proof: PaymentProof) {
  if (!proof?.file?.data) {
    toastMessage("error", "Fichier non disponible");
    return null;
  }

  try {
    let base64Data: string;
    const fileData = proof.file.data;

    // Convert different data types to base64
    if (typeof fileData === "string") {
      // If already base64, use as is
      base64Data = fileData.includes("base64,")
        ? fileData.split("base64,")[1]
        : fileData;
    } else if (fileData instanceof Buffer) {
      base64Data = fileData.toString("base64");
    } else if (fileData instanceof ArrayBuffer) {
      base64Data = Buffer.from(fileData).toString("base64");
    } else if (fileData.buffer instanceof ArrayBuffer) {
      base64Data = Buffer.from(fileData.buffer).toString("base64");
    } else {
      throw new Error("Format de fichier non supporté");
    }

    return {
      data: `data:${
        proof.file.contentType || "image/png"
      };base64,${base64Data}`,
      name: proof.file.name,
    };
  } catch (error) {
    console.error("Error processing proof:", error);
    toastMessage("error", "Erreur lors de l'affichage de la preuve");
    return null;
  }
}
