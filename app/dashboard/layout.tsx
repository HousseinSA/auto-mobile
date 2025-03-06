import PageBackground from "@/lib/globals/PageBackground"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <PageBackground />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto md:py-8 md:px-6 lg:px-8">
        <div className="bg-white rounded-none md:rounded-2xl shadow-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
