import { create } from "zustand"
import { FormState, Service } from "@/lib/types/ServiceTypes"
import { SERVICE_OPTIONS } from "@/lib/constants/serviceOptions"

export const useFormStore = create<FormState>()((set, get) => ({
  fuelType: "",
  ecuType: "",
  generation: "",
  ecuNumber: "",
  boschNumber: "",
  serviceOptions: {},
  stockFile: null,

  handleFuelTypeChange: (value) => {
    set({
      fuelType: value,
      ecuType: "",
      generation: "",
      ecuNumber: "",
      boschNumber: "",
      serviceOptions: {},
    })
  },

  handleEcuTypeChange: (value) => {
    set({
      ecuType: value,
      generation: "",
      ecuNumber: "",
      boschNumber: "",
      serviceOptions: {},
    })
  },

  handleGenerationChange: (value) => {
    set({
      generation: value,
      serviceOptions: {},
    })
  },

  handleEcuNumberChange: (e) => {
    set({ ecuNumber: e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 10) })
  },

  handleBoschNumberChange: (e) => {
    set({ boschNumber: e.target.value })
  },

  setServiceOption: (key: string, value: boolean) => {
    const availableServices = get().getAvailableServices()
    if (!availableServices) return

    set((state) => ({
      serviceOptions: {
        ...state.serviceOptions,
        [key]: {
          price: availableServices.options[key].price,
          selected: value,
        },
      },
    }))
  },
  setStockFile: (file: File | null) => {
    set({ stockFile: file })
  },

  calculateTotal: () => {
    const state = get()
    return Object.entries(state.serviceOptions).reduce(
      (acc, [, option]) => (option.selected ? acc + option.price : acc),
      0
    )
  },

  getAvailableServices: () => {
    const state = get()
    if (!state.fuelType || !state.ecuType || !state.generation) return null

    if (state.generation === "GEN1_GEN2") {
      if (state.fuelType === "Diesel") {
        if (state.ecuType === "Denso") {
          return SERVICE_OPTIONS.DENSO_DIESEL_GEN1_GEN2
        } else if (state.ecuType === "Bosch") {
          return SERVICE_OPTIONS.BOSCH_DIESEL_GEN1_GEN2
        }
      } else if (
        state.fuelType === "Essence" &&
        (state.ecuType === "Denso" || state.ecuType === "Delphi")
      ) {
        return SERVICE_OPTIONS.DENSO_DELPHI_ESSENCE_GEN1_GEN2
      }
    } else if (state.generation === "GEN3_GEN4") {
      // Both Denso and Bosch share same options for GEN3_GEN4
      if (state.fuelType === "Diesel") {
        return SERVICE_OPTIONS.DIESEL_GEN3_GEN4
      } else if (state.fuelType === "Essence") {
        return SERVICE_OPTIONS.ESSENCE_GEN3_GEN4
      }
    }
    return null
  },

  getFullEcuNumber: () => {
    const { ecuType, boschNumber, ecuNumber } = get()
    if (ecuType === "Bosch") return boschNumber
    return ecuNumber ? `89663-${ecuNumber}` : ""
  },

  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    set({ stockFile: file })
  },
  resetForm: () => {
    set({
      fuelType: "",
      ecuType: "",
      generation: "",
      ecuNumber: "",
      boschNumber: "",
      serviceOptions: {},
      stockFile: null,
    })
  },

  populateForm: (service: Service) => {
    set({
      fuelType: service.fuelType,
      ecuType: service.ecuType,
      generation: service.generation || "",
      ...(service.ecuType === "Bosch"
        ? { boschNumber: service.ecuNumber }
        : { ecuNumber: service.ecuNumber.split("-")[1] || "" }),
      serviceOptions: Object.fromEntries(
        Object.entries(service.serviceOptions).map(([key, value]) => [
          key,
          { selected: value.selected, price: value.price },
        ])
      ),
      stockFile: service.stockFile ? new File([], service.stockFile) : null,
    })
  },
}))
