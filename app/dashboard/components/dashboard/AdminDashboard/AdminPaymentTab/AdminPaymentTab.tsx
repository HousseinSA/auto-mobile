import { CreditCard } from "lucide-react"

export function AdminPaymentTab() {
  return (
    <div className="p-4 sm:pl-0 h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Paiements</h2>
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Aucun paiement
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n&apos;avez pas encore de paiements.
        </p>
      </div>
    </div>
  )
}
