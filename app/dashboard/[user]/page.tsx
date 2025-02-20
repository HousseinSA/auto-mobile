import Dashboard from "../components/dashboard/Dashboard"

// Define correct types for Next.js 15 page props
type Props = {
  params: Promise<{ user: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Make the component async and handle Promise params
const UserDashboardPage = async ({ params }: Props) => {
  // Await and convert params to string
  const resolvedParams = await params
  const username = String(resolvedParams.user)

  return <Dashboard username={username} />
}

export default UserDashboardPage
