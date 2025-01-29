import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { isTokenExpired } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const expiredToken = isTokenExpired(token as string)

  // Get the user agent and check if mobile
  const userAgent = request.headers.get("user-agent") || ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )

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

  // Then handle mobile/desktop redirects for specific routes
  if (pathname === "/" || pathname === "/pwa") {
    // If mobile and not already on PWA page, redirect to PWA
    if (isMobile && pathname !== "/pwa") {
      url.pathname = "/pwa"
      return NextResponse.redirect(url)
    }

    // If desktop and on PWA page, redirect to home
    if (!isMobile && pathname === "/pwa") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|static|images|.*\\..*|_next).*)",
}
