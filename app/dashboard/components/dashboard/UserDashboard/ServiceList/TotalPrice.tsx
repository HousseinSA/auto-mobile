import { Tag } from "lucide-react"
import React from "react"
interface TotalPriceProps {
  totalPrice: number
}

const TotalPrice = ({ totalPrice }: TotalPriceProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 ">
        <Tag className="h-4 w-4 text-gray-500" />
        <p className="text-sm font-medium text-primary">Prix Total</p>
      </div>
      <p className="text-sm font-semibold">{totalPrice.toFixed(2)} €</p>
    </div>
  )
}

export default TotalPrice
