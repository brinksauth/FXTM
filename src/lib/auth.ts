import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

export function hasAuthSession(cookieValue: string | undefined | null) {
  return cookieValue === 'active';
}

export async function readAuthSession() {
  const cookieStore = await cookies();
  return hasAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}
