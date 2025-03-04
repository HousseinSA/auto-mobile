import { Search, Wrench } from "lucide-react"
import React from "react"

interface NoResultsProps {
  type: "no-services" | "no-search-results"
  isAdmin?: boolean
  filterStatus?: string
}

const NoResults = ({ type, isAdmin = false, filterStatus }: NoResultsProps) => {
  const content = {
    "no-services": {
      icon: <Wrench className="mx-auto h-12 w-12 text-gray-400" />,
      title:
        filterStatus === "completed"
          ? "Aucun service terminé"
          : isAdmin
          ? "Aucun service disponible"
          : "Aucun service",
      description:
        filterStatus === "completed"
          ? "Il n'y a aucun service terminé pour le moment."
          : isAdmin
          ? "Il n'y a actuellement aucun service dans le système."
          : "Vous n'avez pas encore de services.",
    },
    "no-search-results": {
      icon: <Search className="mx-auto h-12 w-12 text-gray-400" />,
      title: "Recherche sans résultats",
      description: "Aucun service ne correspond à votre recherche.",
    },
  }

  const { icon, title, description } = content[type]

  return (
    <div className="text-center py-12">
      {icon}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default NoResults
