"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "./components/DashboardHeader/DashboardHeader"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:py-8  md:px-6 lg:px-8">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-lg overflow-hidden">
          <DashboardHeader username="admin" displayName={session?.user?.name} />
          <div className="flex flex-col sm:flex-row items-start">
            <div className="w-full mt-4 sm:mt-0">
              <div className="p-4 sm:p-6">
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Rechercher par nom de fichier ou client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md w-full"
                  />
                </div>
                {/* ... rest of your AdminDashboard content ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
