import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
    const token = await getToken({ req: request });

    // Define the login and registration paths
    const loginOrRegisterRoutes = ["/login", "/register"];

    // Redirect logged-in users away from login and registration pages
    if (token && loginOrRegisterRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or another page
    }

    // Redirect unauthenticated users to the login page
    if (!token && !loginOrRegisterRoutes.includes(request.nextUrl.pathname)) {
        const url = new URL("/login", request.url); // Redirect to the login page
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Apply middleware to all routes except API and static files
export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};