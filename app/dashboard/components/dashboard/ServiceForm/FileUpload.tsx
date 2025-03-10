import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";
import { useFormStore } from "@/store/FormStore";
import { Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function FileUpload() {
  const form = useFormStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier doit être inférieure à 5MB");
      event.target.value = "";
      return;
    }
    form.setStockFile(file);
  };

  return (
    <div className="inline-block border rounded-lg max-w-[180px]">
      <Button
        type="button"
        variant="ghost"
        className="w-full flex items-center justify-between gap-2 py-2 px-7 hover:bg-gray-50 text-[12px] relative min-h-[42px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Upload className="h-3.5 w-3.5 flex-shrink-0 absolute left-1.5 top-1/2 -translate-y-1/2" />
        <div className="flex-1 text-center text-muted-foreground">
          <span className="block">Si vous avez le fichier,</span>
          <span className="block">sélectionnez-le ici</span>
        </div>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
          )}
        </span>
      </Button>

      {isExpanded && (
        <div className="p-2 border-t">
          <div className="relative">
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".bin"
              className="hidden"
              id="stock-file"
            />
            <Label
              htmlFor="stock-file"
              className={cn(
                "flex items-center gap-2 cursor-pointer p-2",
                "border-2 border-dashed rounded-lg",
                "hover:bg-gray-50 transition-colors",
                "text-sm",
                form.stockFile && "border-primary text-primary"
              )}
            >
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate">
                {form.stockFile ? form.stockFile.name : "Choisir un fichier"}
              </span>
              {form.stockFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.setStockFile(null);
                    const fileInput = document.getElementById(
                      "stock-file"
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
