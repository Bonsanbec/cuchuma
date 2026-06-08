import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { createSession } from '$lib/auth/session';
import { verifyPassword } from '$lib/auth/password';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    assertCsrf(event, data);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user || user.suspended || !(await verifyPassword(password, user.passwordHash))) {
      return fail(400, { message: 'Credenciales inválidas.' });
    }
    await createSession(user.id, event.cookies);
    await audit({ actorId: user.id, action: 'login', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    throw redirect(303, '/admin');
  }
};
