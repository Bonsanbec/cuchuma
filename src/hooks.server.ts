import type { Handle } from '@sveltejs/kit';
import { getCsrfToken } from '$lib/auth/csrf';
import { getSessionUser } from '$lib/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = await getSessionUser(event.cookies);
  event.locals.csrf = getCsrfToken(event.cookies);

  const response = await resolve(event);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  return response;
};
