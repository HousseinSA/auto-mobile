import { create } from 'zustand'
import { FuelType, ECUType, ServiceOptions, Service } from '@/lib/types/ServiceTypes'

interface FormState {
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

export const useFormStore = create<FormState>((set, get) => ({
  fuelType: "",
  ecuType: "",
  ecuNumber: "",
  boschNumber: "",
  serviceOptions: {
    DPF: false,
    Etape1: false,
    Stock: false,
    EGR: false,
    ADBLUE: false,
    "Speed limit": false,
  },

  handleFuelTypeChange: (value) => {
    set({
      fuelType: value,
      ecuType: "",
      ecuNumber: "",
      boschNumber: "",
    })
  },

  handleEcuTypeChange: (value) => {
    set({
      ecuType: value,
      ecuNumber: "",
      boschNumber: "",
    })
  },

  handleEcuNumberChange: (e) => {
    set({ ecuNumber: e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 10) })
  },

  handleBoschNumberChange: (e) => {
    set({ boschNumber: e.target.value })
  },

  setServiceOptions: (updater) => {
    set((state) => ({
      serviceOptions: updater(state.serviceOptions)
    }))
  },

  getFullEcuNumber: () => {
    const { ecuType, boschNumber, ecuNumber } = get()
    if (ecuType === "Bosch") return boschNumber
    return ecuNumber ? `89663-${ecuNumber}` : ""
  },

  resetForm: () => {
    set({
      fuelType: "",
      ecuType: "",
      ecuNumber: "",
      boschNumber: "",
      serviceOptions: {
        DPF: false,
        Etape1: false,
        Stock: false,
        EGR: false,
        ADBLUE: false,
        "Speed limit": false,
      }
    })
  },

  populateForm: (service) => {
    set({
      fuelType: service.fuelType,
      ecuType: service.ecuType,
      ...(service.ecuType === "Bosch"
        ? { boschNumber: service.ecuNumber }
        : { ecuNumber: service.ecuNumber.split("-")[1] || "" }),
      serviceOptions: { ...service.serviceOptions }
    })
  }
}))