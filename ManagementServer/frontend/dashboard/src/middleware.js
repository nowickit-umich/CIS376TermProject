import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Middleware only runs for /dashboard routes, but we still double check
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Only run middleware for /dashboard and its subpaths
export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
