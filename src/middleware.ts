import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const demoRole = req.cookies.get('unitalent_role')?.value;
    const userRole = token?.role || demoRole;

    // Защита маршрутов студента
    if (pathname.startsWith('/student') && userRole && userRole !== 'STUDENT' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Защита маршрутов работодателя
    if (pathname.startsWith('/employer') && userRole && userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Защита маршрутов панели администратора
    if (pathname.startsWith('/admin') && userRole && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // В локальном режиме, при наличии cookie роли или токена разрешаем доступ
        if (process.env.NODE_ENV !== 'production' || req.cookies.get('unitalent_role')) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'unitalent-super-secret-jwt-key-2026-min-32-chars',
  }
);

export const config = {
  matcher: ['/student/:path*', '/employer/:path*', '/admin/:path*'],
};

