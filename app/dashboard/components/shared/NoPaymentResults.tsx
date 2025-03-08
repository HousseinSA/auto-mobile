import { CircleDollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

interface NoPaymentResultsProps {
  type: "no-pending" | "no-verified" | "no-unpaid" | "no-failed"
  isAdmin?: boolean
}

const NoPaymentResults = ({ type, isAdmin = false }: NoPaymentResultsProps) => {
  const content = {
    "no-unpaid": {
      icon: <CircleDollarSign className="mx-auto h-12 w-12 text-gray-400" />,
      title: "Aucun paiement à effectuer",
      description: "Vous n'avez aucun service en attente de paiement.",
    },
    "no-pending": {
      icon: <Clock className="mx-auto h-12 w-12 text-gray-400" />,
      title: "Aucun paiement en attente",
      description: isAdmin
        ? "Aucun paiement en attente de vérification."
        : "Vous n'avez aucun paiement en attente de vérification.",
    },
    "no-verified": {
      icon: <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />,
      title: "Aucun paiement vérifié",
      description: isAdmin
        ? "Aucun paiement n'a été vérifié."
        : "Vous n'avez aucun paiement vérifié.",
    },
    "no-failed": {
      icon: <XCircle className="mx-auto h-12 w-12 text-gray-400" />,
      title: "Aucun paiement rejeté",
      description: isAdmin
        ? "Aucun paiement n'a été rejeté."
        : "Vous n'avez aucun paiement rejeté.",
    },
  }

  const { icon, title, description } = content[type]

  return (
    <div className="text-center py-12">
      {icon}
      <h3 className="mt-2 text-lg font-medium text-primary">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default NoPaymentResults