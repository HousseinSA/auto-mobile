import { paymentMethods } from "../constants/paymentMethods";
import { ServiceOptions } from "./ServiceTypes"

export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED"
export type PaymentMethod = keyof typeof paymentMethods;

export interface PaymentService {
  _id: string
  userName: string
  ecuType: string
  totalPrice: number
  createdAt: Date
  fuelType: string
  ecuNumber: string
  generation: string
  serviceOptions: ServiceOptions
}

export interface PaymentProof {
  file: {
    name: string
    data: Buffer | ArrayBuffer | string | Uint8Array
    contentType?: string
    uploadedAt: Date
  }
  uploadedAt: Date
  verifiedAt?: Date
}

export interface Payment {
  _id: string
  serviceId: string
  amount: number         
  method: PaymentMethod  
  status: PaymentStatus
  proof?: PaymentProof
  createdAt: Date
  updatedAt: Date
  service?: {
    _id: string
    clientName: string
    phoneNumber: string
    ecuType: string
    fuelType: string
    generation: string
    ecuNumber: string
    totalPrice: number
    serviceOptions: ServiceOptions
    status?: string
    createdAt:Date
    modifiedFile?: {
      name: string
      data: Buffer | string
      uploadedAt: Date
    }
  }
}