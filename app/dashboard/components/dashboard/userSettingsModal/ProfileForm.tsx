import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUserSettingsStore } from "@/store/userSettingsStore"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { ConfirmModal } from "@/lib/globals/confirm-modal"
import { useFormValidation } from "@/lib/utils/useFormValidation"
import { ValidationFields } from "@/lib/utils/validation"

interface ProfileFormProps {
  username: string
}

export function ProfileForm({ username }: ProfileFormProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const { errors, validateField, formatField } = useFormValidation()
  const {
    profile,
    initialValues,
    ui: {
      loading: { profile: isUpdating },
    },
    hasChanges,
    setProfile,
    updateProfile,
  } = useUserSettingsStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as ValidationFields
    const { value } = e.target
    const formattedValue = formatField(name, value)

    if (validateField(name, formattedValue)) {
      setProfile({ [name]: formattedValue })
    }
  }

  const handleUpdateProfile = () => {
    setShowUpdateModal(true)
  }

  const isValidForm =
    !Object.values(errors).some((error) => error) &&
    profile.phoneNumber.length === 8 &&
    profile.fullName.trim().length >= 2

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
        <Input
          id="username"
          defaultValue={profile.username}
          placeholder={initialValues.username}
          disabled
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          name="email"
          id="email"
          defaultValue={profile.email}
          placeholder={initialValues.email}
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          name="fullName"
          value={profile.fullName}
          onChange={handleInputChange}
          placeholder={initialValues.fullName}
          className="w-full"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          inputMode="numeric"
          value={profile.phoneNumber}
          onChange={handleInputChange}
          maxLength={8}
          placeholder={initialValues.phoneNumber}
          className="w-full"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber}</p>
        )}
      </div>

      <Button
        onClick={handleUpdateProfile}
        disabled={isUpdating || !hasChanges.profile || !isValidForm}
        className="w-full text-white"
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin mr-2" />{" "}
            <>Mise à jour...</>
          </>
        ) : (
          "Mettre à jour le profil"
        )}
      </Button>
      <ConfirmModal
        isOpen={showUpdateModal}
        onConfirm={() => {
          updateProfile(username)
          setShowUpdateModal(false)
        }}
        onCancel={() => setShowUpdateModal(false)}
        title="Mettre à jour le profil"
        description="Êtes-vous sûr de vouloir mettre à jour votre profil ?"
      />
    </div>
  )
}
