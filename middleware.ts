import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { isTokenExpired } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const expiredToken = isTokenExpired(token as string)
  // Get the current path and search params
  const url = request.nextUrl.clone()
  const { pathname, search } = url

  // Handle auth redirects first
  if (expiredToken) {
    if (!pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(`/auth${search}`, request.url))
    }
  } else {
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(`/${search}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|static|images|.*\\..*|_next).*)",
}
