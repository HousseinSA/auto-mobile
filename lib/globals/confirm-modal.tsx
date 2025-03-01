import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-[95%] sm:w-[440px] rounded-lg p-4 sm:p-6 gap-4">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg sm:text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <AlertDialogCancel
            onClick={onCancel}
            className="w-full sm:w-auto mt-0"
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto text-white"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
