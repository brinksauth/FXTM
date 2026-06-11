import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';
import { mockUser } from '@/data/mockData';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (
    email.toLowerCase() !== mockUser.email.toLowerCase() ||
    password !== mockUser.password
  ) {
    return NextResponse.json(
      { ok: false, message: 'Correo o clave de acceso incorrectos.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, 'active', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
