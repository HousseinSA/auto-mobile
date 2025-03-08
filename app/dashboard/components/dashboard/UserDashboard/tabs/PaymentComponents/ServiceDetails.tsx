import { Service } from "@/lib/types/ServiceTypes"
import { ServiceOptions } from "../../ServiceList/ServiceOptions"
import { dateFormat } from "@/lib/globals/dateFormat"

export function ServiceDetails({ service }: { service: Service }) {
  return (
    <div>
      <p className="font-medium">Service #{service._id.slice(-6)}</p>
      <div className="space-y-1 mt-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">Carburant:</span> {service.fuelType}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">ECU:</span> {service.ecuType}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary ">Numéro de software:</span> {service.ecuNumber}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">Génération:</span> {service.generation}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">Date:</span> {dateFormat( service.createdAt)}
        </p>
      </div>
      <ServiceOptions serviceOptions={service.serviceOptions} />
      <p className="text-sm font-medium mt-2  text-primary">Montant: {service.totalPrice}€</p>
    </div>
  )
}