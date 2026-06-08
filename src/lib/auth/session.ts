import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/db/prisma';
import { createToken, sha256 } from '$lib/server/crypto';

export const sessionCookieName = env.SESSION_COOKIE_NAME || 'cuchuma_session';

function ttlDays() {
  const parsed = Number(env.SESSION_TTL_DAYS || '30');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

export async function createSession(userId: string, cookies: Cookies) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + ttlDays() * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt
    }
  });
  cookies.set(sessionCookieName, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt
  });
}

export async function destroySession(cookies: Cookies) {
  const token = cookies.get(sessionCookieName);
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  cookies.delete(sessionCookieName, { path: '/' });
}

export async function getSessionUser(cookies: Cookies) {
  const token = cookies.get(sessionCookieName);
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { include: { role: true } } }
  });
  if (!session || session.expiresAt <= new Date() || session.user.suspended) {
    cookies.delete(sessionCookieName, { path: '/' });
    return null;
  }
  await prisma.session.update({
    where: { id: session.id },
    data: { lastSeenAt: new Date() }
  });
  return session.user;
}
