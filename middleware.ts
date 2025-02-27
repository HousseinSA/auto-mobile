import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  const publicRoutes = ["/login", "/register"]

  if (publicRoutes.includes(pathname)) {
    if (token) {
      if (token.name?.toLowerCase() === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
    }
    return NextResponse.next()
  }

  // Handle root path
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (token.name?.toLowerCase() === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(
      new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
    )
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (pathname === "/dashboard") {
      if (token.name?.toLowerCase() === "admin") {
        return NextResponse.next()
      }
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
    }

    const user = decodeURIComponent(pathname.split("/")[2])
    if (token.name?.toLowerCase() === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    if (user && token.name?.toLowerCase() !== user.toLowerCase()) {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.name?.toLowerCase()}`, request.url)
      )
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
