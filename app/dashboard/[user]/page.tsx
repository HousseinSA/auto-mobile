import Dashboard from "../components/dashboard/Dashboard"

const UserDashboardPage = ({ params }: { params: { user: string } }) => {
  const username = params.user // No need for String() since params.user is already a string
  return <Dashboard username={username} />
}

export default UserDashboardPage
