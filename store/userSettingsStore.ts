/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand"
import { signOut } from "next-auth/react"
import toastMessage from "@/lib/ToastMessage"

interface UserSettingsState {
  profile: {
    fullName: string
    username: string
    phoneNumber: string
  }
  initialValues: {
    fullName: string
    username: string
    phoneNumber: string
    password: string
  }
  passwords: {
    current: string
    new: string
    confirm: string
  }
  ui: {
    loading: boolean
    showPassword: {
      current: boolean
      new: boolean
      confirm: boolean
    }
  }
  hasChanges: {
    profile: boolean
    password: boolean
  }
}

export const useUserSettingsStore = create<
  UserSettingsState & {
    setProfile: (updates: Partial<UserSettingsState["profile"]>) => void
    setPasswords: (updates: Partial<UserSettingsState["passwords"]>) => void
    togglePasswordVisibility: (
      field: keyof UserSettingsState["ui"]["showPassword"]
    ) => void
    setLoading: (isLoading: boolean) => void
    fetchUserData: (username: string) => Promise<void>
    updateProfile: (username: string) => Promise<void>
    updatePassword: (username: string) => Promise<void>
    deleteAccount: (username: string) => Promise<void>
    resetForm: () => void
  }
>((set, get) => ({
  profile: {
    fullName: "",
    username: "",
    phoneNumber: "",
  },
  initialValues: {
    fullName: "",
    username: "",
    phoneNumber: "",
    password: "",
  },
  passwords: {
    current: "",
    new: "",
    confirm: "",
  },
  ui: {
    loading: false,
    showPassword: {
      current: false,
      new: false,
      confirm: false,
    },
  },
  hasChanges: {
    profile: false,
    password: false,
  },

  setProfile: (updates) => {
    set((state) => {
      const newProfile = { ...state.profile, ...updates }

      const hasChanges =
        newProfile.phoneNumber !== state.initialValues.phoneNumber ||
        newProfile.fullName !== state.initialValues.fullName ||
        newProfile.username !== state.initialValues.username

      return {
        profile: newProfile,
        hasChanges: { ...state.hasChanges, profile: hasChanges },
      }
    })
  },

  setPasswords: (updates) => {
    set((state) => {
      const newPasswords = { ...state.passwords, ...updates }
      const hasValidChanges =
        newPasswords.current.length > 0 &&
        newPasswords.new.length > 0 &&
        newPasswords.confirm.length > 0 &&
        newPasswords.new === newPasswords.confirm &&
        newPasswords.new !== newPasswords.current &&
        newPasswords.current === state.initialValues.password

      return {
        passwords: newPasswords,
        hasChanges: { ...state.hasChanges, password: hasValidChanges },
      }
    })
  },

  togglePasswordVisibility: (field) => {
    set((state) => ({
      ui: {
        ...state.ui,
        showPassword: {
          ...state.ui.showPassword,
          [field]: !state.ui.showPassword[field],
        },
      },
    }))
  },

  setLoading: (isLoading) =>
    set((state) => ({
      ui: { ...state.ui, loading: isLoading },
    })),

  resetForm: () => {
    const { initialValues } = get()
    set({
      profile: {
        fullName: initialValues.fullName,
        username: initialValues.username,
        phoneNumber: initialValues.phoneNumber,
      },
      passwords: {
        current: initialValues.password,
        new: "",
        confirm: "",
      },
      ui: {
        loading: false,
        showPassword: {
          current: false,
          new: false,
          confirm: false,
        },
      },
      hasChanges: {
        profile: false,
        password: false,
      },
    })
  },

  fetchUserData: async (username) => {
    try {
      const res = await fetch(`/api/users/${username}`)
      const data = await res.json()
      if (res.ok) {
        set({
          profile: {
            fullName: data.fullName,
            username,
            phoneNumber: data.phoneNumber,
          },
          initialValues: {
            fullName: data.fullName,
            username,
            phoneNumber: data.phoneNumber,
            password: data.password,
          },
          passwords: {
            current: data.password,
            new: "",
            confirm: "",
          },
        })
      }
    } catch (error) {
      toastMessage("error", "Erreur lors du chargement des données")
    }
  },

  updateProfile: async (username) => {
    const { profile, setLoading } = get()
    if (!profile.fullName || !profile.phoneNumber) {
      toastMessage("error", "Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${username}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          ...(profile.username !== username
            ? { newUsername: profile.username }
            : {}),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toastMessage("success", "Profil mis à jour avec succès")
      await signOut({ redirect: false })
      window.location.href = "/login" 
      if (profile.username !== username) {
        await signOut({ redirect: false })
        window.location.href = "/login"
      }
    } catch (error) {
      toastMessage(
        "error",
        error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      )
    } finally {
      setLoading(false)
    }
  },

  updatePassword: async (username) => {
    const { passwords, initialValues, setLoading, resetForm } = get()

    if (passwords.new === passwords.current) {
      toastMessage(
        "error",
        "Le nouveau mot de passe doit être différent de l'actuel"
      )
      return
    }

    if (passwords.current !== initialValues.password) {
      toastMessage("error", "Le mot de passe actuel est incorrect")
      return
    }

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toastMessage("error", "Veuillez remplir tous les champs")
      return
    }

    if (passwords.new !== passwords.confirm) {
      toastMessage("error", "Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${username}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      if (!res.ok) throw new Error("Échec de la mise à jour")

      toastMessage("success", "Mot de passe mis à jour avec succès")
      resetForm()
      await signOut({ redirect: false })
      window.location.href = "/login"
    } catch (error) {
      toastMessage("error", "Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  },

  deleteAccount: async (username) => {
    const { setLoading } = get()
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${username}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Échec de la suppression")

      await signOut({ redirect: false })
      window.location.href = "/login"
    } catch (error) {
      toastMessage("error", "Erreur lors de la suppression")
      setLoading(false)
    }
  },
}))
