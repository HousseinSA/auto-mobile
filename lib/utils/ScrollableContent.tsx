interface ScrollableContentProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export const ScrollableTabContent = ({
  children,
  header,
  className = "",
}: ScrollableContentProps) => (
  <div className={`flex flex-col h-[calc(100vh-180px)] ${className}`}>
    {header && <div className="sticky top-0 bg-white z-20 pb-2">{header}</div>}
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 py-2">{children}</div>
    </div>
  </div>
);
