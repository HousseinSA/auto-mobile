import { Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils/utils"

interface ConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  isLoading = false,
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
            disabled={isLoading}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto",
              "bg-red-600 hover:bg-red-700",
              "text-white",
              "flex items-center justify-center gap-2"
            )}
            style={{ background: "red" }}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
