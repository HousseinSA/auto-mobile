import Dashboard from "../components/dashboard/userDashboard"

type Props = {
  params: Promise<{ user: string }>
}

export default async function UserDashboardPage({ params }: Props) {
  const resolvedParams = await params
  const username = String(resolvedParams.user)

  return <Dashboard username={username} />
}
