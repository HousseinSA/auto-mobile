import Dashboard from '../components/dashboard/Dashboard'


interface PageProps {
    params: {
        user: string
    }
}

const UserDashboardPage = ({ params }: PageProps) => {

    return (
        <Dashboard username={params.user} />
    )
}

export default UserDashboardPage