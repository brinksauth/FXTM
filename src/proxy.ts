import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login', '/api/auth/logout'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === '/' ? pathname === '/' : pathname === path,
  );
  const isProtectedDashboardPath =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthed = sessionCookie === 'active';

  if (isProtectedDashboardPath && !isAuthed) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isPublicPath || isAuthed) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
