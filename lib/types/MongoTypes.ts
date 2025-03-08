import { Binary, Document, ObjectId } from "mongodb"
import { PaymentMethod, PaymentStatus } from "./PaymentTypes"

export interface AggregationStage {
  $lookup?: {
    from: string
    localField: string
    foreignField: string
    as: string
  }
  $unwind?: string
  $match?: Record<string, unknown>
  $sort?: Record<string, number>
}

export interface PaymentDocument extends Document {
  _id: ObjectId
  serviceId: ObjectId
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  proof?: {
    file: {
      name: string
      data: Binary
      uploadedAt: Date
    }
  }
  createdAt: Date
  updatedAt: Date
  verifiedBy?: string
  service: {
    _id: ObjectId
    clientName: string
    phoneNumber:string
    totalPrice: number
  }
}
