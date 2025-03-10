export const paymentMethods: Record<
  "BANKILY" | "SEDAD" | "MASRVI" | "PAYPAL",
  {
    label: string;
    value: string;
    icon: string;
    description?: string;
  }
> = {
  BANKILY: {
    label: "Bankily",
    value: "30607010",
    icon: "🏦",
  },
  PAYPAL: {
    label: "PayPal",
    value: "Khounaawa@gmail.com",
    icon: "💳",
  },
  SEDAD: {
    label: "Sedad",
    value: "30607010",
    icon: "🏦",
  },
  MASRVI: {
    label: "Masrvi",
    value: "30607010",
    icon: "🏦",
  },
} as const;
