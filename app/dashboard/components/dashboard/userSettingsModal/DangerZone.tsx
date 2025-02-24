import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useUserSettingsStore } from "@/store/userSettingsStore"

interface DangerZoneProps {
  username: string
}

export function DangerZone({ username }: DangerZoneProps) {
  const {
    ui: { loading },
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
          onClick={() => deleteAccount(username)}
          disabled={loading}
          className="w-full"
        >
          Supprimer mon compte
        </Button>
      </div>
    </div>
  )
}
