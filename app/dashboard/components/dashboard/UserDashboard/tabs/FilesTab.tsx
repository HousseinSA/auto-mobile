import { FileText, Download, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useServiceStore } from "@/store/ServiceStore"
import { Service } from "@/lib/types/ServiceTypes"
import { shortenFileName } from "@/lib/utils/fileUtils"
import { useSession } from "next-auth/react"
import { useAdminStore } from "@/store/AdminStore"
import { dateFormat } from "@/lib/globals/dateFormat"
import { ServiceOptions } from "../ServiceList/ServiceOptions"

export function FilesTab() {
  const { data: session } = useSession()
  const { services, fetchUserServices, loading } = useServiceStore()
  const { downloadFile } = useAdminStore()

  useEffect(() => {
    if (session?.user?.name && !services.length) {
      fetchUserServices(session.user.name)
    }
  }, [fetchUserServices, session?.user?.name, services.length])

  // Filter services to only show those with modified files
  const servicesWithFiles = services.filter((service) => service.modifiedFile)

  if (loading && !services.length) {
    return (
      <div className="p-4 sm:pl-0 min-h-[calc(100vh-300px)]">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Mes fichiers
        </h3>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!servicesWithFiles.length) {
    return (
      <div className="p-4 sm:pl-0 min-h-[calc(100vh-300px)]">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Mes fichiers
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mb-2" />
          <p>Aucun fichier disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:pl-0 min-h-[calc(100vh-300px)]">
      <h3 className="text-lg font-semibold mb-4 text-primary">Mes fichiers</h3>
      <div className="grid gap-4">
        {servicesWithFiles.map((service: Service) => (
          <div key={service._id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">Informations du service</h4>
                <p className="text-sm text-gray-500">ECU: {service.ecuType}</p>
                <p className="text-sm text-gray-500">
                  Carburant: {service.fuelType}
                </p>
                <p className="text-sm text-gray-500">
                  Numéro ECU: {service.ecuNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Prix total: {service.totalPrice}€
                </p>
                <ServiceOptions serviceOptions={service.serviceOptions} />
              </div>
              <div className="text-sm text-gray-500">
                {dateFormat(service.createdAt)}
              </div>
            </div>

            <button
              onClick={() => downloadFile(service.modifiedFile!, true)}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-green-700">
                    Fichier modifié
                  </span>
                  <p className="text-xs text-green-600">
                    {shortenFileName(service.modifiedFile!.name)}
                  </p>
                </div>
              </div>
              <Download className="h-5 w-5 text-green-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
