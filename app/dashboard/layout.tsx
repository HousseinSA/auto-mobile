
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col w-full mx-auto">
          <div className="flex-1 bg-white overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
