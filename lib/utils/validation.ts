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
      const pattern = /^[423][0-9]*$/
      if (!pattern.test(value)) return false
      return value.length <= 8
    },
    pattern: "^[423][0-9]{7}$",
    format: (value: string) => value.replace(/[^0-9]/g, ""),
    error: "Le numéro doit commencer par 4, 2 ou 3 et contenir 8 chiffres",
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
