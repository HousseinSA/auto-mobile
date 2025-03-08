import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

interface ProofDialogProps {
  selectedProof: { data: string; name: string } | null
  onClose: () => void
}

export function ProofDialog({ selectedProof, onClose }: ProofDialogProps) {
  return (
    <Dialog open={!!selectedProof} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] h-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Preuve de paiement - {selectedProof?.name}
          </DialogTitle>
        </DialogHeader>
        {selectedProof && (
          <div className="relative w-full h-full">
            <div className="max-h-[70vh] overflow-auto">
              <Image
                src={selectedProof.data}
                alt="Preuve de paiement"
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-lg"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}