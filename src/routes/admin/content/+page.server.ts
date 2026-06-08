import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canModerate } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanHtml, cleanText, slugify } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canModerate(locals.user?.role.level)) throw redirect(303, '/admin');
  const [categories, contributions, articles, reflections] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.contribution.findMany({ include: { author: true, category: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.article.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.reflection.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' }, take: 100 })
  ]);
  return { categories, contributions, articles, reflections };
}

export const actions = {
  moderate: async (event) => {
    if (!canModerate(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const status = cleanText(data.get('status'));
    if (!['APPROVED', 'REJECTED'].includes(status)) return fail(400, { message: 'errors.invalidStatus' });
    const entity = cleanText(data.get('entity'));
    const id = cleanText(data.get('id'));
    const update = { status: status as 'APPROVED' | 'REJECTED', publishedAt: status === 'APPROVED' ? new Date() : null };
    if (entity === 'contribution') {
      await prisma.contribution.update({ where: { id }, data: { ...update, reviewerId: event.locals.user?.id, rejectionNote: cleanText(data.get('rejectionNote')) || null } });
    } else if (entity === 'article') {
      await prisma.article.update({ where: { id }, data: { status: update.status } });
    } else if (entity === 'reflection') {
      await prisma.reflection.update({ where: { id }, data: update });
    } else {
      return fail(400, { message: 'errors.invalidEntity' });
    }
    await audit({ actorId: event.locals.user?.id, action: status.toLowerCase(), entity, entityId: id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.updated' };
  },
  category: async (event) => {
    if (!canModerate(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const name = cleanText(data.get('name'));
    if (!name) return fail(400, { message: 'errors.fillAllFields' });
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { description: cleanText(data.get('description')) || null },
      create: { name, slug: slugify(name), description: cleanText(data.get('description')) || null }
    });
    await audit({ actorId: event.locals.user?.id, action: 'upsert', entity: 'category', entityId: category.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  article: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    if (!title) return fail(400, { message: 'errors.fillAllFields' });
    const article = await prisma.article.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        outlet: cleanText(data.get('outlet')),
        authorName: cleanText(data.get('authorName')) || null,
        publishedOn: new Date(cleanText(data.get('publishedOn'))),
        url: cleanText(data.get('url')),
        summary: cleanText(data.get('summary')),
        status: canModerate(event.locals.user.role.level) ? 'APPROVED' : 'PENDING',
        createdById: event.locals.user.id,
        categoryId: cleanText(data.get('categoryId')) || null
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'create', entity: 'article', entityId: article.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  reflection: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    if (!title) return fail(400, { message: 'errors.fillAllFields' });
    const status = canModerate(event.locals.user.role.level) ? 'APPROVED' : 'PENDING';
    const reflection = await prisma.reflection.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        body: cleanHtml(cleanText(data.get('body'))),
        status,
        publishedAt: status === 'APPROVED' ? new Date() : null,
        createdById: event.locals.user.id,
        categoryId: cleanText(data.get('categoryId')) || null
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'create', entity: 'reflection', entityId: reflection.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  }
};
