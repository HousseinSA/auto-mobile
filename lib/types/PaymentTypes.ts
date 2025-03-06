export type PaymentStatus = "pending" | "completed" | "failed"
export type PaymentMethod = "paypal" | "bankily"

export interface Payment {
  _id: string
  serviceId: string
  userId: string
  amount: number
  status: PaymentStatus
  paymentMethod: PaymentMethod
  transactionId: string
  proofImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentDetails {
  paypal: {
    email: string
    instructions: string
  }
  bankily: {
    number: string
    accountName: string
    instructions: string
  }
}
