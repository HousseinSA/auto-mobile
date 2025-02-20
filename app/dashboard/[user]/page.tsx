import Dashboard from "../components/dashboard/Dashboard"

interface PageProps {
  params: {
    user: string
  }
  searchParams: { [key: string]: string | string[] } | undefined
}

const UserDashboardPage = ({ params }: PageProps) => {
  const username = String(params.user)
  return <Dashboard username={username} />
}

export default UserDashboardPage
