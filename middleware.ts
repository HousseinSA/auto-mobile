import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // List of public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register']

    // Allow access to public routes without a token
    if (publicRoutes.includes(pathname)) {
        // If user is authenticated and tries to access login/register, redirect to dashboard
        if (token && (pathname === '/login' || pathname === '/register')) {
            return NextResponse.redirect(
                new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
            )
        }
        // If user is not authenticated and tries to access root, redirect to login
        if (!token && pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/dashboard/')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Ensure users can only access their own dashboard
        const user = decodeURIComponent(pathname.split('/')[2])
        if (user && token.name?.toLowerCase() !== user.toLowerCase()) {
            return NextResponse.redirect(
                new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:user*',
        '/login',
        '/register'
    ]
}