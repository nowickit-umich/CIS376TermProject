import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log (' Middleware triggered for:', request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;

  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !token
  ) {
    console.log(' No token found. Redirecting to login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Token found or not a protected route. Proceeding.');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
