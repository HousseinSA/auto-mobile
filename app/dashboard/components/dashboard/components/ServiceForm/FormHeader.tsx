interface FormHeaderProps {
  editingService: boolean
}

export function FormHeader({ editingService }: FormHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <h3 className="text-lg font-semibold text-primary">
        {editingService ? "Modifier le service" : "Ajouter un service"}
      </h3>
    </div>
  )
}
