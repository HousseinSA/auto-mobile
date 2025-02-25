// Basic Types
export type ECUType = "Denso" | "Delphi" | "Bosch"
export type FuelType = "Essence" | "Diesel"
export type ServiceStatus =
  | "EN ATTENTE"
  | "EN TRAITEMENT"
  | "TERMINÉ"
  | "ANNULÉ"

// Service Options Interface
export interface ServiceOptions {
  Etape1: boolean
  EGR: boolean
  Stock: boolean
  DPF: boolean
  ADBLUE: boolean
  "Speed limit": boolean
}

// Form State Interface
export interface FormState {
  fuelType: FuelType | ""
  ecuType: ECUType | ""
  ecuNumber: string
  boschNumber: string
  serviceOptions: ServiceOptions
  handleFuelTypeChange: (value: FuelType) => void
  handleEcuTypeChange: (value: ECUType) => void
  handleEcuNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBoschNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setServiceOptions: (updater: (prev: ServiceOptions) => ServiceOptions) => void
  getFullEcuNumber: () => string
  resetForm: () => void
  populateForm: (service: Service) => void
}

// Service Store State Interface
export interface ServiceState {
  services: Service[]
  loading: boolean
  error: string
  showForm: boolean
  editingService: Service | null
  setShowForm: (show: boolean) => void
  setEditingService: (service: Service | null) => void
  fetchUserServices: (username: string) => Promise<void>
  deleteService: (serviceId: string) => Promise<boolean>
  updateService: (serviceId: string, data: ServiceRequest) => Promise<boolean>
  addService: (username: string) => Promise<boolean>
}

// Service Request Interface
export interface ServiceRequest {
  fuelType: FuelType
  ecuType: ECUType
  ecuNumber: string
  serviceOptions: ServiceOptions
  userName: string
  status?: ServiceStatus
}

// Service Interface (extends ServiceRequest)
export interface Service extends ServiceRequest {
  _id: string
  createdAt: string
  updatedAt: string
  clientName: string
  phoneNumber: string
  status: ServiceStatus
}
