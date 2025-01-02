import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { isTokenExpired } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const expiredToken = isTokenExpired(token as string)

  // Redirect unauthenticated users to login page
  // if (expiredToken) {
  //   if (!request.nextUrl.pathname.startsWith("/auth")) {
  //     return NextResponse.redirect(new URL("/auth", request.url))
  //   }
  // } else {
  //   // Redirect authenticated users from login page to dashboard
  //   if (request.nextUrl.pathname.startsWith("/auth")) {
  //     return NextResponse.redirect(new URL("/", request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
