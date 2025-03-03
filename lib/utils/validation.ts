export type ValidationFields =
  | "phoneNumber"
  | "email"
  | "username"
  | "fullName"
  | "password"

export interface ValidationField {
  validate: (value: string) => boolean
  format: (value: string) => string
  pattern?: string
  error: string
}

export const validation: Record<ValidationFields, ValidationField> = {
  phoneNumber: {
    validate: (value: string) => {
      if (value.length === 0) return true
      // Looser validation during typing, just check for valid characters
      const typingPattern = /^[0-9+\s-]*$/
      return typingPattern.test(value)
    },
    format: (value: string) => value.replace(/[^0-9+\s-]/g, ""),
    pattern: "^\\+?[0-9\\s-]{8,15}$",
    error:
      "Le numéro doit contenir entre 8 et 15 chiffres et peut commencer par +",
  },
  email: {
    validate: (value: string) => {
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return pattern.test(value)
    },
    format: (value: string) => value.trim(),
    error: "Veuillez entrer une adresse email valide",
  },
  username: {
    validate: (value: string) => {
      if (value.length === 0) return true
      return /^[a-zA-Z0-9]+$/.test(value)
    },
    format: (value: string) => value.replace(/[^a-zA-Z0-9]/g, ""),
    error: "L'identifiant ne doit contenir que des lettres et des chiffres",
  },
  fullName: {
    validate: (value: string) => {
      if (value.length === 0) return true
      return /^[a-zA-ZÀ-ÿ\s]+$/.test(value)
    },
    format: (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""),
    pattern: "^[a-zA-ZÀ-ÿ\\s]+$",
    error: "Le nom ne doit contenir que des lettres",
  },
  password: {
    validate: (value: string) => {
      if (value.length === 0) return true
      if (value.length > 20) return false
      return /^[a-zA-Z0-9@#$%&*!?_.-]*$/.test(value)
    },
    format: (value: string) => {
      if (value.length > 20) return value.slice(0, 20)
      return value.replace(/[^a-zA-Z0-9@#$%&*!?_.-]/g, "")
    },
    pattern: "^[a-zA-Z0-9@#$%&*!?_.-]{5,20}$",
    error: "Le mot de passe doit contenir entre 5 et 20 caractères ",
  },
}
