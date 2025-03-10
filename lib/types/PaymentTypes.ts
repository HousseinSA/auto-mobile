import { Service, ServiceOptions } from "./ServiceTypes";

export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED";
export type PaymentMethod = "BANKILY" | "SEDAD" | "MASRVI" | "PAYPAL";
export interface PaymentService {
  _id: string;
  userName: string;
  ecuType: string;
  totalPrice: number;
  createdAt: Date;
  fuelType: string;
  ecuNumber: string;
  generation: string;
  serviceOptions: ServiceOptions;
}

export interface PaymentProof {
  file: {
    name: string;
    data: Buffer | ArrayBuffer | string | Uint8Array;
    contentType?: string;
    uploadedAt: Date;
  };
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface Payment {
  _id: string;
  amount: number;
  serviceId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  proof?: PaymentProof;
  createdAt: Date;
  updatedAt: Date;
  service: Service;
}
