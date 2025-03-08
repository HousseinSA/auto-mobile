
export const paymentMethods: Record<
  "BANKILY" | "PAYPAL",
  {
    label: string
    value: string
    icon: string
    description?: string
  }
> = {
  BANKILY: {
    label: "Bankily / Sedad / Masrvi",
    value: "30607010",
    icon: "🏦",
  },
  PAYPAL: {
    label: "PayPal",
    value: "Khounaawa@gmail.com",
    icon: "💳",
  }
} as const