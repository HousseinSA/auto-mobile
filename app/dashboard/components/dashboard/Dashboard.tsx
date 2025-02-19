"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { UserCircle, LogOut, Upload, Loader2 } from "lucide-react"
import { useFileStore } from "@/store/FileStore"

interface DashboardProps {
  username: string
}

export default function Dashboard({ username }: DashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { files, loading, error, uploadFile, fetchUserFiles } = useFileStore()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (
      status === "authenticated" &&
      session.user?.name?.toLowerCase() !== username.toLowerCase()
    ) {
      router.push(`/dashboard/${session.user?.name?.toLowerCase()}`)
      return
    }

    // Fetch user's files when component mounts
    fetchUserFiles(username)
  }, [status, session, router, username, fetchUserFiles])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const success = await uploadFile(file, username)
    if (success) {
      await fetchUserFiles(username)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-16 w-16 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tableau de bord de {session?.user?.name}
                  </h2>
                  <p className="text-gray-500">
                    Gérez votre compte et vos paramètres
                  </p>
                </div>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".bin,.hex,.txt"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex text-white items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Téléverser un fichier{" "}
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Files List Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vos fichiers</h3>
            <div className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-500">
                      Type: {file.fileType} | Téléchargé:{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
                </div>
              ))}
              {files.length === 0 && (
                <p className="py-4 text-center text-gray-500">
                  Aucun fichier téléchargé pour le moment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
