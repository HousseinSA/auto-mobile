import { cn } from "@/lib/utils/utils";

interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const TabTrigger = ({
  value,
  children,
  isActive,
  onClick,
}: TabTriggerProps) => {
  return (
    <button
      value={value}
      onClick={onClick}
      className={cn(
        "flex-1",
        "inline-flex items-center justify-center whitespace-nowrap",
        "py-2 px-4",
        "text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "text-primary rounded-md mx-0.5",
        "hover:bg-primary/5",
        isActive && "bg-primary text-white hover:bg-primary/90"
      )}
    >
      {children}
    </button>
  );
};

export default TabTrigger;
