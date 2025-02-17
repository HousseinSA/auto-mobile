/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
                setLoading(false);
                return;
            }

            setLoading(false);
            toast.success(data.message);
            router.push('/');
        } catch (err) {
            setLoading(false);
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-700">Créer un compte                </h1>
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
                        className="w-full p-2 text-white  transition-colors"
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
    );
};

export default Register;