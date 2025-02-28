// DangerZone.tsx
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useUserSettingsStore } from "@/store/userSettingsStore"
import { useState } from "react"
import { ConfirmModal } from "@/lib/confirm-modal"

interface DangerZoneProps {
  username: string
}

export function DangerZone({ username }: DangerZoneProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const {
    ui: {
      loading: { delete: isDeleting },
    },
    deleteAccount,
  } = useUserSettingsStore()

  return (
    <div className="border-t pt-4 mt-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Zone dangereuse
        </h4>
        <p className="text-sm text-muted-foreground">
          Une fois votre compte supprimé, toutes vos données seront
          définitivement effacées.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="w-full"
        >
          {isDeleting && <Loader2 className="w-8 h-8 animate-spin mr-2" />}
          Supprimer mon compte
        </Button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={() => {
          deleteAccount(username)
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
        title="Supprimer le compte"
        description="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement effacées."
      />
    </div>
  )
}
