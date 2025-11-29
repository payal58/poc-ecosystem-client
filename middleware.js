import { NextResponse } from 'next/server'

export function middleware(request) {
  // Note: We're using client-side authentication with localStorage
  // The middleware can't access localStorage, so we let the client-side
  // AdminLayout handle authentication checks instead
  // This prevents redirect loops when tokens are stored in localStorage
  
  // Allow all requests - authentication is handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

