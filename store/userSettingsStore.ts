/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand"
import { signOut } from "next-auth/react"
import toastMessage from "@/lib/globals/ToastMessage"

interface UserSettingsState {
  profile: {
    username: string
    fullName: string
    email: string
    phoneNumber: string
  }
  initialValues: {
    username: string
    fullName: string
    phoneNumber: string
    email: string
    password: string
  }
  passwords: {
    current: string
    new: string
    confirm: string
  }
  ui: {
    loading: {
      profile: boolean
      password: boolean
      delete: boolean
    }
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
    setLoading: (
      type: keyof UserSettingsState["ui"]["loading"],
      isLoading: boolean
    ) => void
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
    email: "",
    phoneNumber: "",
  },
  initialValues: {
    fullName: "",
    email: "",
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
    loading: {
      profile: false,
      password: false,
      delete: false,
    },
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
        newProfile.fullName !== state.initialValues.fullName

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

  setLoading: (
    type: keyof UserSettingsState["ui"]["loading"],
    isLoading: boolean
  ) =>
    set((state) => ({
      ui: {
        ...state.ui,
        loading: {
          ...state.ui.loading,
          [type]: isLoading,
        },
      },
    })),

  resetForm: () => {
    const { initialValues } = get()
    set({
      profile: {
        username: initialValues.username,
        email: initialValues.email,
        fullName: initialValues.fullName,
        phoneNumber: initialValues.phoneNumber,
      },
      passwords: {
        current: initialValues.password,
        new: "",
        confirm: "",
      },
      ui: {
        loading: {
          profile: false,
          password: false,
          delete: false,
        },
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
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
          },
          initialValues: {
            username: data.username,
            fullName: data.fullName,
            email: data.email,
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

    setLoading("profile", true)
    try {
      const res = await fetch(`/api/users/${username}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toastMessage("success", "Profil mis à jour avec succès")
      await signOut({ redirect: true, callbackUrl: "/login" })
    } catch (error) {
      toastMessage(
        "error",
        error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      )
    } finally {
      setLoading("profile", false)
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

    setLoading("password", true)
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
      await signOut({ redirect: true, callbackUrl: "/login" })
    } catch (error) {
      toastMessage("error", "Erreur lors de la mise à jour")
    } finally {
      setLoading("password", false)
    }
  },

  deleteAccount: async (username) => {
    const { setLoading } = get()
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return

    setLoading("delete", true)
    try {
      const res = await fetch(`/api/users/${username}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Échec de la suppression")

      await signOut({ redirect: true, callbackUrl: "/login" })
    } catch (error) {
      toastMessage("error", "Erreur lors de la suppression")
      setLoading("delete", false)
    }
  },
}))
