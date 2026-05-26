import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve edge session cookie
  const sessionRoleCookie = request.cookies.get('vp_role');
  const role = sessionRoleCookie?.value;

  const isAuthenticated = !!role;

  // Helper flags
  const isAuthRoute = pathname.startsWith('/login');
  
  // Dashboard routes are client/admin views
  const isDashboardRoute =
    pathname === '/' ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/settings');

  const isAdminOnlyRoute = pathname.startsWith('/settings');

  // 1. Guard against unauthenticated users attempting dashboard access
  if (isDashboardRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    // Persist original intent for post-login redirect
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Redirect already logged-in users trying to access login
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/invoices', request.url));
  }

  // 3. Simple edge-level RBAC block: Client user tries to access Admin route
  if (isAdminOnlyRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 4. Default root '/' redirect to relevant dashboard home
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/invoices', request.url));
  }

  return NextResponse.next();
}

// Optimization: Apply matcher config to skip running middleware on static resources & assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
