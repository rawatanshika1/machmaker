import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/customer' || pathname.startsWith('/customer/');

  if (isProtectedPath) {
    const session = request.cookies.get('matchmaker-session')?.value;

    if (!session) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/customer/:path*'],
};
