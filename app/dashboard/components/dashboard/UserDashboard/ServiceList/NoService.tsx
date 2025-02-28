import { Wrench } from "lucide-react"
import React from "react"

const NoService = () => {
  return (
    <div className="text-center py-12">
      <Wrench className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Aucun service
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Vous n&apos;avez pas encore de services.
      </p>
    </div>
  )
}

export default NoService
