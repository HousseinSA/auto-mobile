export type ECUType = "Denso" | "Delphi" | "Bosch"
export type FuelType = "Essence" | "Diesel"

export interface ServiceOptions {
  Etape1: boolean
  EGR: boolean
  Stock: boolean
  DPF: boolean
  ADBLUE: boolean
  "Speed limit": boolean
}

export type ServiceStatus =
  | "EN ATTENTE"
  | "EN TRAITEMENT"
  | "TERMINÉ"
  | "ANNULÉ"

export interface ServiceRequest {
  fuelType: FuelType
  ecuType: ECUType
  ecuNumber: string
  serviceOptions: ServiceOptions
  userName: string
  status?: ServiceStatus
}

export interface Service extends ServiceRequest {
  _id: string
  createdAt: string
  updatedAt: string
  clientName: string
  phoneNumber: string
  status: ServiceStatus
}
