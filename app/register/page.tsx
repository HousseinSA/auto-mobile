'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const Register = () => {
    const router = useRouter()
    const { name, password, error, loading, setName, setPassword, register } = useAuthStore()

    const handleRegister = async (e: React.FormEvent) => {
        const success = await register(e)
        if (success) {
            toast.success('Inscription réussie!')
            router.push('/')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-700">Créer un compte</h1>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <form onSubmit={handleRegister} className="mt-6">
                    <div className="mb-4">
                        <Input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-primary rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-primary rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full p-2 text-white transition-colors"
                        disabled={loading}
                    >
                        {loading && <ClipLoader size={20} color='white' className='mr-2' />}
                        S&apos;inscrire
                    </Button>
                </form>
                <p className="mt-4 text-center text-gray-700">
                    Vous avez déjà un compte ? <a href="/login" className="text-primary hover:underline">Se connecter</a>
                </p>
            </div>
        </div>
    )
}

export default Register