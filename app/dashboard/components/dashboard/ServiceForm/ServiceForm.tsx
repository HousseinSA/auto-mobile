import { Service } from "@/lib/types/ServiceTypes";
import { useFormStore } from "@/store/FormStore";
import { FormHeader } from "./FormHeader";
import { SelectionsGroup } from "./SelectionsGroup";
import { ECUNumberInput } from "./ECUNumberInput";
import { ServiceFormOptions } from "./ServiceFormOptions";
import { FileUpload } from "./FileUpload";
import { FormActions } from "./FormActions";

interface ServiceFormProps {
  username: string;
  showForm: boolean;
  editingService: Service | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export function ServiceForm({
  editingService,
  isSubmitting,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const form = useFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
    form.setStockFile(null);
  };

  return (
    <div className=" py-2  border-b border-gray-200 service-form">
      <FormHeader editingService={!!editingService} />

      <div className="mt-3">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <SelectionsGroup />
          <ECUNumberInput />
          <ServiceFormOptions />
          <FileUpload />
          <FormActions
            isSubmitting={isSubmitting}
            editingService={editingService}
            onCancel={onCancel}
          />
        </form>
      </div>
    </div>
  );
}
