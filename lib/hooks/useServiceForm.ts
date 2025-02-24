import { useState } from "react"
import { useServiceStore } from "@/store/ServiceStore"
import { ECUType, FuelType, ServiceOptions } from "@/types/ServiceTypes"
import toastMessage from "@/lib/ToastMessage"

export function useServiceForm(username: string) {
  const { addService, fetchUserServices } = useServiceStore()
  const [fuelType, setFuelType] = useState<FuelType | "">("")
  const [ecuType, setEcuType] = useState<ECUType | "">("")
  const [ecuNumber, setEcuNumber] = useState("89663")
  const [boschNumber, setBoschNumber] = useState("")
  const [serviceOptions, setServiceOptions] = useState<ServiceOptions>({
    Etape1: false,
    EGR: false,
    Stock: false,
    DPF: false,
    "Speed limit": false,
  })

  const handleFuelTypeChange = (value: FuelType) => {
    setFuelType(value)
    setEcuType("")
  }

  const handleEcuTypeChange = (value: ECUType) => {
    setEcuType(value)
  }

  const handleEcuNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 5)
    setEcuNumber(value)
  }

  const handleBoschNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBoschNumber(value)
  }

  const resetForm = () => {
    setFuelType("")
    setEcuType("")
    setEcuNumber("89663")
    setBoschNumber("")
    setServiceOptions({
      Etape1: false,
      EGR: false,
      DPF: false,
      Stock: false,
      "Speed limit": false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fuelType || !ecuType) {
      toastMessage("error", "Veuillez remplir tous les champs")
      return false
    }

    const hasSelectedOption = Object.values(serviceOptions).some(
      (value) => value
    )
    if (!hasSelectedOption) {
      toastMessage("error", "Veuillez sélectionner au moins une option")
      return false
    }

    const success = await addService({
      fuelType,
      ecuType,
      ecuNumber:
        fuelType === "Diesel" && ecuType === "Bosch" ? boschNumber : ecuNumber,
      serviceOptions,
      userName: username,
    })

    if (success) {
      await fetchUserServices(username)
      resetForm()
      return true
    }

    return false
  }

  return {
    fuelType,
    ecuType,
    ecuNumber,
    boschNumber,
    serviceOptions,
    handleFuelTypeChange,
    handleEcuTypeChange,
    handleEcuNumberChange,
    handleBoschNumberChange,
    setServiceOptions,
    handleSubmit,
    resetForm,
  }
}
