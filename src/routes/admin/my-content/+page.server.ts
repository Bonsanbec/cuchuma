import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanHtml, cleanText, slugify } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  
  const [categories, contributions, articles, reflections] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.contribution.findMany({
      where: { authorId: locals.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.article.findMany({
      where: { createdById: locals.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.reflection.findMany({
      where: { createdById: locals.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { categories, contributions, articles, reflections, csrf: locals.csrf };
}

export const actions = {
  article: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);

    const title = cleanText(data.get('title'));
    const outlet = cleanText(data.get('outlet'));
    const publishedOnStr = cleanText(data.get('publishedOn'));
    const url = cleanText(data.get('url'));
    const summary = cleanText(data.get('summary'));

    if (!title || !outlet || !publishedOnStr || !url || !summary) {
      return fail(400, { message: 'errors.fillAllFields' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        outlet,
        authorName: cleanText(data.get('authorName')) || null,
        publishedOn: new Date(publishedOnStr),
        url,
        summary,
        status: 'PENDING',
        createdById: event.locals.user.id,
        categoryId: cleanText(data.get('categoryId')) || null
      }
    });

    await audit({
      actorId: event.locals.user.id,
      action: 'create_pending',
      entity: 'article',
      entityId: article.id,
      ipAddress: event.getClientAddress()
    });

    return { message: 'notifications.saved' };
  },
  reflection: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);

    const title = cleanText(data.get('title'));
    const body = cleanHtml(cleanText(data.get('body')));

    if (!title || !body) {
      return fail(400, { message: 'errors.fillAllFields' });
    }

    const reflection = await prisma.reflection.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        body,
        status: 'PENDING',
        createdById: event.locals.user.id,
        categoryId: cleanText(data.get('categoryId')) || null
      }
    });

    await audit({
      actorId: event.locals.user.id,
      action: 'create_pending',
      entity: 'reflection',
      entityId: reflection.id,
      ipAddress: event.getClientAddress()
    });

    return { message: 'notifications.saved' };
  }
};
