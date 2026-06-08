import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanHtml, cleanText, slugify } from '$lib/server/sanitize';
import { saveUpload } from '$lib/storage';

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  return { categories: await prisma.category.findMany({ orderBy: { name: 'asc' } }) };
}

export const actions = {
  default: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    const body = cleanHtml(cleanText(data.get('body')));
    const type = cleanText(data.get('type'));
    if (!title || !body || !['MEMORY', 'EVIDENCE'].includes(type)) {
      return fail(400, { message: 'Completa título, tipo y texto.' });
    }
    const contribution = await prisma.contribution.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        body,
        type: type as 'MEMORY' | 'EVIDENCE',
        status: 'PENDING',
        authorId: event.locals.user.id,
        categoryId: cleanText(data.get('categoryId')) || null,
        externalLinks: cleanText(data.get('externalLinks')).split('\n').map((link) => link.trim()).filter(Boolean)
      }
    });
    const uploads = data.getAll('files').filter((value): value is File => value instanceof File && value.size > 0);
    for (const file of uploads) {
      const saved = await saveUpload(file);
      await prisma.mediaFile.create({
        data: {
          ...saved,
          title: file.name,
          authorId: event.locals.user.id,
          contributionId: contribution.id
        }
      });
    }
    await audit({ actorId: event.locals.user.id, action: 'create_pending', entity: 'contribution', entityId: contribution.id, ipAddress: event.getClientAddress() });
    return { message: 'Gracias. El equipo revisará tu material antes de publicarlo.' };
  }
};
