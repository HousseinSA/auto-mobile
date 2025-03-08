import { Service } from "@/lib/types/ServiceTypes"
import { ServiceOptions } from "../../ServiceList/ServiceOptions"

export function ServiceDetails({ service }: { service: Service }) {
  return (
    <div>
      <p className="font-medium">Service #{service._id.slice(-6)}</p>
      <div className="space-y-1 mt-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">ECU:</span> {service.ecuType}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">N° ECU:</span> {service.ecuNumber}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Carburant:</span> {service.fuelType}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Génération:</span> {service.generation}
        </p>
      </div>
      <ServiceOptions serviceOptions={service.serviceOptions} />
      <p className="text-sm font-medium mt-2">Montant: {service.totalPrice}€</p>
    </div>
  )
}