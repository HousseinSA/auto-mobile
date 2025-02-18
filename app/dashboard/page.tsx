'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'


export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const isAdmin = useAuthStore(state => state.checkIsAdmin())
    function handleSignOut() {
        signOut({ callbackUrl: "/" })
      }
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        if (!isAdmin && session?.user?.name) {
            router.push(`/dashboard/${session.user.name}`)
        }
    }, [status, session, router, isAdmin])

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <button
        onClick={handleSignOut}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600 transition-colors shadow-lg"
      >
        Se déconnecter
      </button>
            </div>
        </div>
    )
}