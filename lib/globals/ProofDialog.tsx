import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ProofDialogProps {
  selectedProof: { data: string; name: string } | null;
  onClose: () => void;
}

export function ProofDialog({ selectedProof, onClose }: ProofDialogProps) {
  return (
    <Dialog open={!!selectedProof} onOpenChange={() => onClose()}>
      <DialogContent className="w-[80vw] max-w-[700px] h-auto py-4">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Preuve de paiement - {selectedProof?.name}
          </DialogTitle>
        </DialogHeader>
        {selectedProof && (
          <div className="flex justify-center">
            <div className="max-w-[90%] max-h-[70vh] overflow-auto">
              <Image
                src={selectedProof.data}
                alt="Preuve de paiement"
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-lg"
                style={{ maxHeight: "70vh" }}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
