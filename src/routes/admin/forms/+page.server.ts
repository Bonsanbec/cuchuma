import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canModerate } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText, slugify } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canModerate(locals.user?.role.level)) throw redirect(303, '/admin');
  const forms = await prisma.citizenForm.findMany({
    include: { fields: { orderBy: { position: 'asc' } }, _count: { select: { responses: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const responses = await prisma.formResponse.findMany({ include: { form: true }, orderBy: { createdAt: 'desc' }, take: 50 });
  return { forms, responses };
}

export const actions = {
  create: async (event) => {
    if (!canModerate(event.locals.user?.role.level) || !event.locals.user) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    if (!title) return fail(400, { message: 'errors.fillAllFields' });
    const labels = data.getAll('fieldLabel').map(cleanText).filter(Boolean);
    const types = data.getAll('fieldType').map(cleanText);
    const required = new Set(data.getAll('required').map(cleanText));
    const options = data.getAll('options').map(cleanText);
    const form = await prisma.citizenForm.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        description: cleanText(data.get('description')),
        active: data.get('active') === 'on',
        createdById: event.locals.user.id,
        fields: {
          create: labels.map((label, index) => ({
            label,
            type: (types[index] || 'SHORT_TEXT') as never,
            required: required.has(String(index)),
            options: (options[index] || '').split(',').map((item) => item.trim()).filter(Boolean),
            position: index + 1
          }))
        }
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'create', entity: 'form', entityId: form.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  toggle: async (event) => {
    if (!canModerate(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const form = await prisma.citizenForm.update({ where: { id: cleanText(data.get('id')) }, data: { active: data.get('active') === 'on' } });
    await audit({ actorId: event.locals.user?.id, action: 'toggle', entity: 'form', entityId: form.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.updated' };
  },
  delete: async (event) => {
    if (!canModerate(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const id = cleanText(data.get('id'));
    if (!id) return fail(400, { message: 'errors.fillAllFields' });

    await prisma.citizenForm.delete({ where: { id } });
    await audit({ actorId: event.locals.user?.id, action: 'delete', entity: 'form', entityId: id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.deleted' };
  }
};
