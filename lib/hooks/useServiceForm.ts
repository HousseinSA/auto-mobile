import { useState } from "react"
import {
  FuelType,
  ECUType,
  Service,
  ServiceOptions,
} from "@/lib/types/ServiceTypes"

export function useServiceForm(username: string) {
  const [fuelType, setFuelType] = useState<FuelType | "">("")
  const [ecuType, setEcuType] = useState<ECUType | "">("")
  const [ecuNumber, setEcuNumber] = useState("")
  const [boschNumber, setBoschNumber] = useState("")
  const [serviceOptions, setServiceOptions] = useState<ServiceOptions>({
    DPF: false,
    Etape1: false,
    Stock: false,
    EGR: false,
    ADBLUE: false,
    "Speed limit": false,
  })

  const handleFuelTypeChange = (value: FuelType) => {
    setFuelType(value)
    setEcuType("")
    setEcuNumber("")
    setBoschNumber("")
  }

  const handleEcuTypeChange = (value: ECUType) => {
    setEcuType(value)
    setEcuNumber("")
    setBoschNumber("")
  }

  const handleEcuNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
    setEcuNumber(value)
  }

  const handleBoschNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoschNumber(e.target.value)
  }

  const getFullEcuNumber = () => {
    if (ecuType === "Bosch") return boschNumber
    return ecuNumber ? `89663-${ecuNumber}` : ""
  }

  const populateForm = (service: Service) => {
    setFuelType(service.fuelType)
    setEcuType(service.ecuType)

    if (service.ecuType === "Bosch") {
      setBoschNumber(service.ecuNumber)
    } else {
      const number = service.ecuNumber.split("-")[1] || ""
      setEcuNumber(number)
    }

    // Create a new object to ensure state update
    setServiceOptions({ ...service.serviceOptions })
  }

  const resetForm = () => {
    setFuelType("")
    setEcuType("")
    setEcuNumber("")
    setBoschNumber("")
    setServiceOptions({
      DPF: false,
      Etape1: false,
      Stock: false,
      EGR: false,
      ADBLUE: false,
      "Speed limit": false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const serviceData = {
      fuelType,
      ecuType,
      ecuNumber: getFullEcuNumber(),
      serviceOptions,
      userName: username,
    }

    try {
      const res = await fetch("/api/services/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      })

      if (!res.ok) throw new Error("Erreur lors de l'ajout du service")
      return true
    } catch (error) {
      console.error(error)
      return false
    }
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
    getFullEcuNumber,
    resetForm,
    populateForm,
    handleSubmit,
  }
}
