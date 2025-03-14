import { useState } from "react";
import { PaymentProof, PaymentStatus } from "@/lib/types/PaymentTypes";
import { Button } from "@/components/ui/button";
import { Eye, Upload, Loader2 } from "lucide-react";
import toastMessage from "@/lib/globals/ToastMessage";
import { processProofData } from "./proofUtils";

interface ProofViewerProps {
  proof?: PaymentProof;
  isAdmin?: boolean;
  onProofChange?: (file: File) => Promise<void>;
  serviceId?: string;
  onView?: (proofData: { data: string; name: string }) => void;
  status?: PaymentStatus;
}

export function ProofViewer({
  proof,
  isAdmin = false,
  onProofChange,
  onView,
  status,
}: ProofViewerProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastMessage("error", "File must not exceed 5MB");
      return;
    }

    setLoading(true);
    try {
      await onProofChange?.(file);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toastMessage("error", "Error updating proof");
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    if (proof) {
      const proofData = processProofData(proof);
      if (proofData && onView) {
        onView(proofData);
      }
    }
  };

  const getButtonText = () => {
    if (loading) return "Changement...";
    if (status === "FAILED") return proof ? "Réessayer" : "Ajouter preuve";
    return proof ? "Changer preuve" : "Ajouter preuve";
  };

  return (
    <div className="flex items-center gap-2">
      {proof && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleView}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Eye className="h-4 w-4" />
          Voir preuve
        </Button>
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
          {(status === "FAILED" || status === "PENDING") && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
              asChild
            >
              <span>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {getButtonText()}
              </span>
            </Button>
          )}
        </label>
      )}
    </div>
  );
}
