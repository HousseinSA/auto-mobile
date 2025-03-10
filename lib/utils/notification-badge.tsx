interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <span className=" -top-3 -right-3 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
      {count}
    </span>
  );
}
