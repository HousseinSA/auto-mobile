import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUserSettingsStore } from "@/store/userSettingsStore"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { ConfirmModal } from "@/lib/confirm-modal"
import { useFormValidation } from "@/lib/utils/useFormValidation"

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

  const validatePhoneNumber = (value: string) => {
    // Allow only numbers starting with 4, 2, or 3
    const pattern = /^[423][0-9]*$/
    if (!pattern.test(value)) return false
    return value.length <= 8
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (value === "" || validatePhoneNumber(value)) {
      setProfile({ phoneNumber: value })
    }
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow letters with spaces between words
    if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
      // Prevent multiple consecutive spaces
      const trimmedValue = value.replace(/\s+/g, " ")
      setProfile({ fullName: trimmedValue })
    }
  }

  // Validation for submit button
  const isValidForm =
    profile.phoneNumber.length === 8 &&
    /^[423]\d{7}$/.test(profile.phoneNumber) &&
    profile.fullName.trim().length >= 2 &&
    profile.username.length >= 3 &&
    profile.username.length <= 20 &&
    /^[a-zA-Z0-9]+$/.test(profile.username)

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
          defaultValue={profile.fullName}
          onChange={handleFullNameChange}
          placeholder={initialValues.fullName}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>

        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          inputMode="numeric"
          value={profile.phoneNumber}
          onChange={handlePhoneNumberChange}
          maxLength={8}
          placeholder={initialValues.phoneNumber}
          className="w-full"
        />
      </div>

      <Button
        onClick={() => updateProfile(username)}
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
