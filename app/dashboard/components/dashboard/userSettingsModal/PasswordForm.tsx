import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useUserSettingsStore } from "@/store/userSettingsStore"
import { useState } from "react"
import { ConfirmModal } from "@/lib/globals/confirm-modal"

interface PasswordFormProps {
  username: string
}

export function PasswordForm({ username }: PasswordFormProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const {
    passwords,
    ui: {
      loading: { password: isUpdating },
      showPassword,
    },
    initialValues,
    hasChanges,
    setPasswords,
    togglePasswordVisibility,
    updatePassword,
  } = useUserSettingsStore()

  // Simplified validation
  const passwordsMatch =
    passwords.new && passwords.confirm && passwords.new === passwords.confirm
  const isSameAsCurrentPassword =
    passwords.new && passwords.new === initialValues.password

  const handleUpdatePassword = () => {
    setShowUpdateModal(true)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={"text"}
            defaultValue={initialValues.password}
            placeholder={initialValues.password}
            disabled
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword.new ? "text" : "password"}
            defaultValue={passwords.new}
            placeholder="Entrer nouveau mot de passe"
            onChange={(e) => setPasswords({ new: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => togglePasswordVisibility("new")}
          >
            {showPassword.new ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isSameAsCurrentPassword && (
          <p className="text-sm text-destructive">
            Le nouveau mot de passe doit être différent de l&apos;actuel
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            defaultValue={passwords.confirm}
            placeholder="Confirmer nouveau mot de passe"
            onChange={(e) => setPasswords({ confirm: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => togglePasswordVisibility("confirm")}
          >
            {showPassword.confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {passwords.new && passwords.confirm && !passwordsMatch && (
          <p className="text-sm text-destructive">
            Les mots de passe ne correspondent pas
          </p>
        )}
      </div>

      <Button
        onClick={handleUpdatePassword}
        disabled={isUpdating || !hasChanges.password}
        className="w-full text-white"
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Mise à jour...
          </>
        ) : (
          "Mettre à jour le mot de passe"
        )}
      </Button>

      <ConfirmModal
        isOpen={showUpdateModal}
        onConfirm={() => {
          updatePassword(username)
          setShowUpdateModal(false)
        }}
        onCancel={() => setShowUpdateModal(false)}
        title="Mettre à jour le mot de passe"
        description="Êtes-vous sûr de vouloir mettre à jour votre mot de passe ? Vous devrez vous reconnecter avec votre nouveau mot de passe."
      />
    </div>
  )
}
