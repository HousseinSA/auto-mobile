import { Hash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStore } from "@/store/FormStore"

export function ECUNumberInput() {
  const form = useFormStore()

  if (!form.ecuType) return null

  return (
    <div>
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-gray-500" />
        <Label htmlFor="ecuNumber" className="text-primary">
          Numéro ECU
        </Label>
      </div>
      <div className="flex gap-2 mt-1">
        {form.ecuType === "Bosch" ? (
          <Input
            id="boschNumber"
            value={form.boschNumber}
            onChange={form.handleBoschNumberChange}
            placeholder="EDC17C01"
            required
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex">
            <Input
              value="89663-"
              disabled
              className="w-[4.5rem] rounded-r-none border-r-0"
            />
            <Input
              id="ecuNumber"
              value={form.ecuNumber}
              onChange={form.handleEcuNumberChange}
              maxLength={10}
              minLength={5}
              placeholder="60R51"
              required
              className="flex-1 rounded-l-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
