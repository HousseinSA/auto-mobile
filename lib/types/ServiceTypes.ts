export type ECUType = "Denso" | "Delphi" | "Bosch"
export type FuelType = "Essence" | "Diesel"

export interface ServiceOptions {
  Etape1: boolean
  EGR: boolean
  Stock: boolean
  DPF:boolean
  "Speed limit": boolean
}

export interface ServiceRequest {
  fuelType: FuelType
  ecuType: ECUType
  ecuNumber: string
  serviceOptions: ServiceOptions
  userName: string
}

export interface Service extends ServiceRequest {
  clientName: string
  phoneNumber: string
  status: "PENDING" | "PROCESSING" | "COMPLETED"
  createdAt: Date
}
