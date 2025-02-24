"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Download, Loader2, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileData {
  id: string
  fileName: string
  fileType: string
  status: string
  uploadedAt: Date
  userName: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = useAuthStore((state) => state.checkIsAdmin())
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  async function fetchAllFiles() {
    setLoading(true)
    try {
      const response = await fetch("/api/files/all")
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(fileId: string, fileName: string) {
    try {
      const response = await fetch(`/api/files/download/${fileId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download file:", error)
    }
  }

  function handleSignOut() {
    signOut({ callbackUrl: "/" })
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    fetchAllFiles()
  }, [status, session, router, isAdmin])

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-16 w-16 text-primary" />
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    Tableau de bord Admin
                  </h2>
                  <p className="text-gray-500">
                    Gérez tous les fichiers des utilisateurs
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Rechercher par nom de fichier ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-white py-4">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredFiles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        Aucun fichier trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file) => (
                      <tr key={`${file.id}-${file.userName}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.fileName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              file.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : file.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : file.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() =>
                              handleDownload(file.id, file.fileName)
                            }
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
