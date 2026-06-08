import { error, type Cookies, type RequestEvent } from '@sveltejs/kit';
import { createToken } from '$lib/server/crypto';

const csrfCookie = 'cuchuma_csrf';

export function getCsrfToken(cookies: Cookies) {
  const existing = cookies.get(csrfCookie);
  if (existing) return existing;
  const token = createToken(24);
  cookies.set(csrfCookie, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  return token;
}

export function assertCsrf(event: RequestEvent, form: FormData) {
  const cookie = event.cookies.get(csrfCookie);
  const submitted = String(form.get('csrf') || '');
  if (!cookie || !submitted || cookie !== submitted) {
    throw error(403, 'La sesión del formulario no es válida.');
  }
}
