import Dashboard from "../components/dashboard/Dashboard"

type Props = {
  params: { user: string }
}

export default async function UserDashboardPage({ params }: Props) {
  const username = await params.user
  return <Dashboard username={username} />
}
