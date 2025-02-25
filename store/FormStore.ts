import { create } from "zustand"
import { FormState, ServiceOptions } from '@/lib/types/ServiceTypes'

const initialServiceOptions: ServiceOptions = {
  DPF: false,
  Etape1: false,
  Stock: false,
  EGR: false,
  ADBLUE: false,
  "Speed limit": false,
}

export const useFormStore = create<FormState>()((set, get) => ({
  // Initialize state
  fuelType: "",
  ecuType: "",
  ecuNumber: "",
  boschNumber: "",
  serviceOptions: { ...initialServiceOptions },

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
      serviceOptions: updater(state.serviceOptions),
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
      serviceOptions: { ...initialServiceOptions },
    })
  },

  populateForm: (service) => {
    set({
      fuelType: service.fuelType,
      ecuType: service.ecuType,
      ...(service.ecuType === "Bosch"
        ? { boschNumber: service.ecuNumber }
        : { ecuNumber: service.ecuNumber.split("-")[1] || "" }),
      serviceOptions: { ...service.serviceOptions },
    })
  },
}))
