import Dashboard from "../components/dashboard/Dashboard"

const UserDashboardPage = ({ params }: { params: { user: string } }) => {
  const username = String(params.user)
  return <Dashboard username={username} />
}

export default UserDashboardPage
