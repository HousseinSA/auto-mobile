import { cn } from "./utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({
  count,
  className,
}: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <span
      className={cn(
        "flex h-4 w-4 items-center justify-center",
        "rounded-full bg-red-500 text-xs font-semibold text-white",
        className
      )}
    >
      {count}
    </span>
  );
}
