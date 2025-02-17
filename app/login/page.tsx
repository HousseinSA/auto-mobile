'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners'
import { useAuthStore } from '@/store/authStore'

const Login = () => {
    const router = useRouter()
    const { name, password, error, loading, setName, setPassword, login } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        const success = await login(e)
        if (success) {
            router.push('/')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-700">Se connecter</h1>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <Input
                            name="name"
                            type="text"
                            placeholder="Nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full text-white transition-colors flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading && <ClipLoader size={20} color='white' className='mr-2' />}
                        Se connecter
                    </Button>
                </form>
                <p className="mt-4 text-center text-gray-700">
                    Vous avez déjà un compte ?<a href="/register" className="text-primary hover:underline"> S&apos;inscrire</a>
                </p>
            </div>
        </div>
    )
}

export default Login