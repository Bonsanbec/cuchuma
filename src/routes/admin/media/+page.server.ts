import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { canModerate } from '$lib/auth/permissions';
import { audit } from '$lib/server/audit';
import { cleanText } from '$lib/server/sanitize';
import { deleteUpload, saveUpload } from '$lib/storage';

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  const media = await prisma.mediaFile.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  return { media };
}

export const actions = {
  upload: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const file = data.get('file');
    if (!(file instanceof File) || file.size === 0) return fail(400, { message: 'errors.fillAllFields' });
    const saved = await saveUpload(file);
    const media = await prisma.mediaFile.create({
      data: {
        ...saved,
        title: cleanText(data.get('title')) || file.name,
        description: cleanText(data.get('description')) || null,
        altText: cleanText(data.get('altText')) || null,
        authorId: event.locals.user.id
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'upload', entity: 'media', entityId: media.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  delete: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);

    const id = cleanText(data.get('id'));
    if (!id) return fail(400, { message: 'errors.fillAllFields' });

    const media = await prisma.mediaFile.findUnique({ where: { id } });
    if (!media) return fail(404, { message: 'errors.notFound' });

    const isModerator = canModerate(event.locals.user.role.level);
    if (media.authorId !== event.locals.user.id && !isModerator) {
      return fail(403, { message: 'errors.unauthorized' });
    }

    await prisma.mediaFile.delete({ where: { id } });
    await deleteUpload(media.storageKey);

    await audit({ actorId: event.locals.user.id, action: 'delete', entity: 'media', entityId: id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.deleted' };
  }
};
