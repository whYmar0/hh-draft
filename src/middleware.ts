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
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Защита маршрутов работодателя
    if (pathname.startsWith('/employer') && userRole && userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Разрешаем свободный просмотр страниц в демо-версии
        return true;
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

