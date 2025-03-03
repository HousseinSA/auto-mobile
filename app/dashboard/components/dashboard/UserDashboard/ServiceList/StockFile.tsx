import { FileText } from "lucide-react"
import React from "react"
import { shortenFileName } from "@/lib/utils/fileUtils"

interface StockFileProps {
  fileName?: string
}

const StockFile = ({ fileName }: StockFileProps) => {
  return (
    <>
      {fileName && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-primary">fichier</p>
          </div>
          <span className="text-sm text-gray-600">
            {shortenFileName(fileName)}
          </span>
        </div>
      )}
    </>
  )
}

export default StockFile
