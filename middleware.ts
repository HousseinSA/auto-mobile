import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  const publicRoutes = ["/login", "/register"]

  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and tries to access login/register, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
    }
    return NextResponse.next()
  }

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname === "/dashboard") {
    if (token?.name) {
      if (token?.name?.toLowerCase() === "admin") {
        return NextResponse.redirect(new URL(`/dashboard`, request.url))
      } else {
        return NextResponse.redirect(
          new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
        )
      }
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Ensure users can only access their own dashboard
    const user = decodeURIComponent(pathname.split("/")[2])
    if (user && token.name?.toLowerCase() !== user.toLowerCase()) {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
    }

    // Redirect admin to /dashboard if trying to access user dashboards
    if (
      token.name?.toLowerCase() === "admin" &&
      user.toLowerCase() !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token || token.name?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:user*", "/admin", "/login", "/register"],
}
