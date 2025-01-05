import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const session = req.cookies.get("session")?.value;

    if (pathname === "/") {
        if (session) {

            return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {

            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
    }

    if (!session && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    if (session && pathname.startsWith("/auth/signin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/signin",
        "/",
    ],
};
