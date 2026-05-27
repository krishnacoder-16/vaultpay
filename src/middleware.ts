import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Retrieve the sovereign session cookie
  const sessionRoleCookie = request.cookies.get('vp_role');
  const role = sessionRoleCookie?.value as 'CLIENT' | 'ADMIN' | undefined;

  const isAuthenticated = !!role;

  // Route groupings definitions
  const isAuthRoute = pathname.startsWith('/login');
  
  const isDashboardRoute =
    pathname === '/' ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/settings');

  const isAdminOnlyRoute = pathname.startsWith('/settings');
  const isClientOnlyRoute = pathname.startsWith('/invoices') || pathname.startsWith('/payments');

  // 2. Guard unauthenticated access
  if (isDashboardRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Redirect authenticated users away from login pages
  if (isAuthRoute && isAuthenticated) {
    // Admins land on their control console, clients land on their invoicing desk
    const destination = role === 'ADMIN' ? '/settings' : '/invoices';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Strict Role-Based Access Isolation
  // Gated Admins to their respective pages
  if (isAdminOnlyRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Gated Clients to their respective pages
  if (isClientOnlyRoute && role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 5. Default root routing redirects
  if (pathname === '/' && isAuthenticated) {
    const destination = role === 'ADMIN' ? '/settings' : '/invoices';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

// Skip static bundle directories & system icons
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
