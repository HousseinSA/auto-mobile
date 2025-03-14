import { Binary } from "mongodb";

// Basic Types
export type ECUType = "Denso" | "Delphi" | "Bosch";
export type FuelType = "Essence" | "Diesel";
export type ServiceStatus =
  | "EN ATTENTE"
  | "EN TRAITEMENT"
  | "TERMINÉ"
  | "ANNULÉ";
export type ToyotaGeneration = "GEN1_GEN2" | "GEN3_GEN4";
export type Generation = "GEN1_GEN2" | "GEN3_GEN4";

export interface FileData {
  name: string;
  data?: string | Binary;
  uploadedAt?: Date;
}
interface ServiceOption {
  price: number;
  selected: boolean;
  dtcDetails?: string;
}

// Service Options Interface
export interface ServiceOptions {
  [key: string]: ServiceOption;
}

export interface ServiceOptionsGroups {
  DENSO_DIESEL: {
    DTC_OFF: ServiceOption;
    IMMO_OFF: ServiceOption;
    VMAX_OFF: ServiceOption;
    DPF_OFF: ServiceOption;
    EGR_OFF: ServiceOption;
    SCR_ADBLUE_OFF: ServiceOption;
    SCV_OFF: ServiceOption;
    STAGE_1: ServiceOption;
    STAGE_2: ServiceOption;
    STOCK: ServiceOption;
    DPF_EGR_SCR_OFF_STAGE1: ServiceOption;
  };
  DENSO_DELPHI_ESSENCE: {
    CAT_OFF: ServiceOption;
    EVAP_OFF: ServiceOption;
    DTC_OFF: ServiceOption;
    EGR_OFF: ServiceOption;
    STAGE_1: ServiceOption;
    STOCK: ServiceOption;
  };
  BOSCH_DIESEL: {
    DTC_OFF: ServiceOption;
    DPF_OFF: ServiceOption;
    EGR_OFF: ServiceOption;
  };
  DIESEL_GEN3_GEN4: {
    DPF_EGR_SCR_OFF: ServiceOption;
    DPF_EGR_SCR_OFF_STAGE1: ServiceOption;
  };
  ESSENCE_GEN3_GEN4: {
    E2_EVAP_OFF: ServiceOption;
    E2_EVAP_OFF_STAGE1: ServiceOption;
  };
}

// Form State Interface
export interface FormState {
  fuelType: FuelType | "";
  ecuType: ECUType | "";
  generation: Generation | "";
  ecuNumber: string;
  boschNumber: string;
  serviceOptions: ServiceOptions;
  stockFile: File | null;
  setStockFile: (file: File | null) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFuelTypeChange: (value: FuelType) => void;
  handleEcuTypeChange: (value: ECUType) => void;
  handleGenerationChange: (value: Generation) => void;
  handleEcuNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBoschNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setServiceOption: (key: string, value: boolean) => void;
  getFullEcuNumber: () => string;
  calculateTotal: () => number;
  getAvailableServices: () => {
    title: string;
    options: { [key: string]: { price: number; label: string } };
  } | null;
  resetForm: () => void;
  populateForm: (service: Service) => void;
  setDtcDetails: (details: string) => void;
  isFileUploadExpanded: boolean;
  setFileUploadExpanded: (expanded: boolean) => void;
}

// Service Store State Interface
export interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string;
  showForm: boolean;
  editingService: Service | null;
  setShowForm: (show: boolean) => void;
  setEditingService: (service: Service | null) => void;
  fetchUserServices: (username: string) => Promise<void>;
  deleteService: (serviceId: string) => Promise<boolean>;
  updateService: (serviceId: string, data: ServiceRequest) => Promise<boolean>;
  addService: (username: string) => Promise<boolean>;
}

// Service Request Interface
export interface ServiceRequest {
  fuelType: FuelType;
  ecuType: ECUType;
  generation: Generation;
  ecuNumber: string;
  serviceOptions: ServiceOptions;
  userName: string;
  status: ServiceStatus;
  stockFile?: {
    name: string;
  } | null;
  totalPrice: number;
}

export interface Service extends Omit<ServiceRequest, "stockFile"> {
  _id: string;
  clientName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  stockFile?: FileData;
  modifiedFile?: FileData;
}
