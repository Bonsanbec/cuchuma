import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canAdmin } from '$lib/auth/permissions';
import { hashPassword } from '$lib/auth/password';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canAdmin(locals.user?.role.level)) throw redirect(303, '/admin');
  const [users, roles] = await Promise.all([
    prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } }),
    prisma.role.findMany({ orderBy: { level: 'asc' } })
  ]);
  return { users, roles };
}

export const actions = {
  create: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const email = cleanText(data.get('email')).toLowerCase();
    const name = cleanText(data.get('name'));
    const password = cleanText(data.get('password'));
    const roleId = cleanText(data.get('roleId'));
    if (!email || !name || password.length < 12 || !roleId) return fail(400, { message: 'errors.fillAllFields' });
    const user = await prisma.user.create({ data: { email, name, roleId, passwordHash: await hashPassword(password) } });
    await audit({ actorId: event.locals.user?.id, action: 'create', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  update: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const id = cleanText(data.get('id'));
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: cleanText(data.get('name')),
        roleId: cleanText(data.get('roleId')),
        suspended: data.get('suspended') === 'on'
      }
    });
    await audit({ actorId: event.locals.user?.id, action: 'update', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.updated' };
  }
};
