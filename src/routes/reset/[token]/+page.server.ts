import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { createSession } from '$lib/auth/session';
import { hashPassword } from '$lib/auth/password';
import { prisma } from '$lib/db/prisma';
import { sha256 } from '$lib/server/crypto';
import { audit } from '$lib/server/audit';

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    assertCsrf(event, data);
    const password = String(data.get('password') || '');
    if (password.length < 12) return fail(400, { message: 'errors.passwordMinLength', params: { min: 12 } });
    const token = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: sha256(event.params.token) },
      include: { user: true }
    });
    if (!token || token.usedAt || token.expiresAt < new Date() || token.user.suspended) {
      return fail(400, { message: 'errors.invalidResetLink' });
    }
    await prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await hashPassword(password) } });
    await prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
    await audit({ actorId: token.userId, action: 'password_reset_completed', entity: 'user', entityId: token.userId, ipAddress: event.getClientAddress() });
    await createSession(token.userId, event.cookies);
    throw redirect(303, '/admin');
  }
};
