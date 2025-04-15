import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow access to login page, landing page, and API routes
  if (pathname === '/login' || pathname === '/' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to login if no auth token
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 