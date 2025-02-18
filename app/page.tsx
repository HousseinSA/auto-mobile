'use client'
import { signOut } from 'next-auth/react'

export default function Home() {
  function handleSignOut() {
    signOut({ callbackUrl: "/" })
  }
  return (
    <div className="space-y-6">
      <button
        onClick={handleSignOut}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600 transition-colors shadow-lg"
      >
        Se déconnecter
      </button>
    </div>
  );
}