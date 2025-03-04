import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ServiceFilterProps {
  searchTerm?: string
  filterStatus: string
  onSearchChange?: (value: string) => void
  onFilterChange: (value: string) => void
  className?: string
  showSearch?: boolean
}

export function ServiceFilter({
  searchTerm = "",
  filterStatus,
  onSearchChange,
  onFilterChange,
  className = "",
  showSearch = true,
}: ServiceFilterProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {showSearch && (
        <Input
          type="text"
          placeholder="Rechercher (nom, ECU, diesel, status...)"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="max-w-md w-full"
        />
      )}
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les services</SelectItem>
          <SelectItem value="active">Services en cours</SelectItem>
          <SelectItem value="completed">Services terminés</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
