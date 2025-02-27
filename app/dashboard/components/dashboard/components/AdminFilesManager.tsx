import { useState } from 'react'
import { Upload, Download, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminFilesManager() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = async (serviceId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/admin/services/${serviceId}/files`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      // Handle successful upload
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-primary">
        Gestionnaire de fichiers
      </h2>
      
      {/* File upload section */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-600">
            Cliquez pour télécharger un fichier
          </span>
        </label>
      </div>

      {/* Files list will be implemented here */}
      <div className="space-y-4">
        {/* Example file item */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-primary" />
            <span>example.bin</span>
          </div>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}