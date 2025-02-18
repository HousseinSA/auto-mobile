'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { UserCircle, LogOut } from 'lucide-react'

interface DashboardProps {
    username: string
}

export default function Dashboard({ username }: DashboardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        // Verify if the user is accessing their own dashboard
        if (status === 'authenticated' &&
            session.user?.name?.toLowerCase() !== username.toLowerCase()) {
            router.push(`/dashboard/${session.user?.name?.toLowerCase()}`)
        }
    }, [status, session, router, username])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <UserCircle className="h-16 w-16 text-primary" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {session?.user?.name}&apos;s Dashboard
                                    </h2>
                                    <p className="text-gray-500">Manage your account and settings</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Rest of your dashboard content */}
                </div>
            </div>
        </div>
    )
}