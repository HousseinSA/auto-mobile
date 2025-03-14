import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/utils";
import { useFormStore } from "@/store/FormStore";
import { Upload, X } from "lucide-react";
import { useEffect } from "react";

export function FileUpload() {
  const {
    isFileUploadExpanded,
    setFileUploadExpanded,
    stockFile,
    setStockFile,
  } = useFormStore();

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
    setStockFile(file);
  };

  useEffect(() => {
    if (!isFileUploadExpanded) {
      setStockFile(null);
      const fileInput = document.getElementById(
        "stock-file"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
    return () => {
      if (stockFile) {
        setStockFile(null);
      }
    };
  }, [isFileUploadExpanded, setStockFile, stockFile]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Checkbox
          id="stock-toggle"
          checked={isFileUploadExpanded}
          className="text-white"
          onCheckedChange={(checked) =>
            setFileUploadExpanded(checked as boolean)
          }
        />
        <Label htmlFor="stock-toggle" className="text-sm cursor-pointer">
          Si vous avez le fichier sélectionner ici
        </Label>
      </div>

      {isFileUploadExpanded && (
        <div className="border rounded-lg p-2">
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
                stockFile && "border-primary text-primary"
              )}
            >
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate">
                {stockFile ? stockFile.name : "Choisir un fichier stock"}
              </span>
              {stockFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setStockFile(null);
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
