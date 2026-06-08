import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canModerate } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText, slugify } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canModerate(locals.user?.role.level)) throw redirect(303, '/admin');
  const [collections, contributions] = await Promise.all([
    prisma.collection.findMany({ include: { items: { include: { contribution: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.contribution.findMany({ where: { status: 'APPROVED' }, orderBy: { publishedAt: 'desc' } })
  ]);
  return { collections, contributions };
}

export const actions = {
  create: async (event) => {
    if (!canModerate(event.locals.user?.role.level) || !event.locals.user) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    const contributionIds = data.getAll('contributionId').map(cleanText).filter(Boolean);
    if (!title) return fail(400, { message: 'La colección necesita título.' });
    const collection = await prisma.collection.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        description: cleanText(data.get('description')),
        published: data.get('published') === 'on',
        createdById: event.locals.user.id,
        items: { create: contributionIds.map((contributionId, index) => ({ contributionId, position: index + 1 })) }
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'create', entity: 'collection', entityId: collection.id, ipAddress: event.getClientAddress() });
    return { message: 'Colección creada.' };
  }
};
