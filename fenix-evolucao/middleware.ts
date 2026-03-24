import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pega o token do cookie (que será definido como httpOnly pela nossa server action / route handler)
  const token = request.cookies.get('legado_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/cadastro');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  // Proteção da rota /admin (RBAC Simples baseado no cookie/role, no futuro decodificaremos o JWT)
  // Por enquanto, apenas verificamos se está logado. Se for admin, o token terá claims específicas.
  
  if (isProtectedRoute && !token) {
    // Redireciona para o login se tentar acessar rota protegida sem token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    // Se já estiver logado e tentar acessar /login, manda pro dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/cadastro'],
};
