import { Binary, Document, ObjectId } from "mongodb";
import { PaymentMethod, PaymentStatus } from "@/lib/types/PaymentTypes";

export interface PaymentDocument extends Document {
  _id: ObjectId;
  serviceId: ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  userName: string;
  proof?: PaymentProof;
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string;
}

export interface PaymentProof {
  file: {
    name: string;
    data: Binary;
    uploadedAt: Date;
    size: number; 
    mimeType: string; 
  };
}

export interface ServiceDetails {
  _id: ObjectId;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
  ecuType: string;
  generation: string;
}
