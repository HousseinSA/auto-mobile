import Dashboard from "../components/dashboard/Dashboard"

export default function UserDashboardPage({
  params,
}: {
  params: { user: string }
}) {
  return <Dashboard username={params.user} />
}
