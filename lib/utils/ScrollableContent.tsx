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
  <div className={`flex flex-col h-full ${className}`}>
    {header && (
      <div className="shrink-0 sticky top-0 z-30 bg-background/95 backdrop-blur-sm shadow-sm px-4 py-3">
        {header}
      </div>
    )}
    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-220px)] md:px-4">
      {children}
    </div>
  </div>
);
