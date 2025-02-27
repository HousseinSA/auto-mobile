import { Home } from "lucide-react"
import Link from "next/link"
import React from "react"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          Désolé, la page que vous recherchez n&apos;existe pas.
        </p>
        <Link
          href={"/"}
          className="mt-6 px-4 py-2 bg-primary text-white rounded flex gap-2 items-center justify-center  "
        >
          <Home />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}

export default NotFound
