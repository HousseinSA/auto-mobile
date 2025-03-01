import { useState } from "react"
import { validation, ValidationFields } from "@/lib/utils/validation"

export function useFormValidation() {
  const [errors, setErrors] = useState<
    Partial<Record<ValidationFields, string>>
  >({})

  const validateField = (name: ValidationFields, value: string) => {
    const field = validation[name]
    if (!field?.validate) return true

    const isValid = field.validate(value)
    setErrors((prev) => ({
      ...prev,
      [name]: isValid ? "" : field.error,
    }))
    return isValid
  }

  const formatField = (name: ValidationFields, value: string) => {
    const field = validation[name]
    return field?.format ? field.format(value) : value
  }

  return {
    errors,
    validateField,
    formatField,
  }
}
