import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { canModerate } from '$lib/auth/permissions';
import { audit } from '$lib/server/audit';
import { cleanHtml, cleanText } from '$lib/server/sanitize';
import { saveUpload } from '$lib/storage';

export async function load({ locals, params }) {
  if (!locals.user) throw redirect(303, '/login');

  const { type, id } = params;
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  let item: any = null;

  if (type === 'contribution') {
    item = await prisma.contribution.findUnique({
      where: { id },
      include: { category: true }
    });
  } else if (type === 'article') {
    item = await prisma.article.findUnique({
      where: { id },
      include: { category: true }
    });
  } else if (type === 'reflection') {
    item = await prisma.reflection.findUnique({
      where: { id },
      include: { category: true }
    });
  } else {
    throw fail(404);
  }

  if (!item) {
    throw fail(404);
  }

  // Authorization check
  const isModerator = canModerate(locals.user.role.level);
  if (!isModerator) {
    // Check ownership and status
    const isOwner =
      type === 'contribution'
        ? item.authorId === locals.user.id
        : item.createdById === locals.user.id;

    if (!isOwner || item.status !== 'PENDING') {
      throw redirect(303, '/admin');
    }
  }

  return { type, id, item, categories, csrf: locals.csrf };
}

export const actions = {
  default: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const { type, id } = event.params;
    const data = await event.request.formData();
    assertCsrf(event, data);

    // Reload item to verify auth again
    let item: any = null;
    if (type === 'contribution') {
      item = await prisma.contribution.findUnique({ where: { id } });
    } else if (type === 'article') {
      item = await prisma.article.findUnique({ where: { id } });
    } else if (type === 'reflection') {
      item = await prisma.reflection.findUnique({ where: { id } });
    }

    if (!item) return fail(404, { message: 'errors.notFound' });

    const isModerator = canModerate(event.locals.user.role.level);
    if (!isModerator) {
      const isOwner =
        type === 'contribution'
          ? item.authorId === event.locals.user.id
          : item.createdById === event.locals.user.id;

      if (!isOwner || item.status !== 'PENDING') {
        throw redirect(303, '/admin');
      }
    }

    if (type === 'contribution') {
      const title = cleanText(data.get('title'));
      const body = cleanHtml(cleanText(data.get('body')));
      const contribType = cleanText(data.get('type'));
      const categoryId = cleanText(data.get('categoryId')) || null;
      const externalLinks = cleanText(data.get('externalLinks'))
        .split('\n')
        .map((link) => link.trim())
        .filter(Boolean);

      if (!title || !body || !['MEMORY', 'EVIDENCE'].includes(contribType)) {
        return fail(400, { message: 'errors.fillAllFields' });
      }

      await prisma.contribution.update({
        where: { id },
        data: {
          title,
          body,
          type: contribType as 'MEMORY' | 'EVIDENCE',
          categoryId,
          externalLinks,
          // Contributors can only keep it PENDING, moderators can auto-approve or keep as is
          status: isModerator ? item.status : 'PENDING'
        }
      });

      // Handle extra file uploads if any
      const uploads = data.getAll('files').filter((value): value is File => value instanceof File && value.size > 0);
      for (const file of uploads) {
        const saved = await saveUpload(file);
        await prisma.mediaFile.create({
          data: {
            ...saved,
            title: file.name,
            authorId: event.locals.user.id,
            contributionId: id
          }
        });
      }

    } else if (type === 'article') {
      const title = cleanText(data.get('title'));
      const outlet = cleanText(data.get('outlet'));
      const publishedOnStr = cleanText(data.get('publishedOn'));
      const url = cleanText(data.get('url'));
      const summary = cleanText(data.get('summary'));
      const categoryId = cleanText(data.get('categoryId')) || null;

      if (!title || !outlet || !publishedOnStr || !url || !summary) {
        return fail(400, { message: 'errors.fillAllFields' });
      }

      await prisma.article.update({
        where: { id },
        data: {
          title,
          outlet,
          publishedOn: new Date(publishedOnStr),
          url,
          summary,
          categoryId,
          status: isModerator ? item.status : 'PENDING'
        }
      });

    } else if (type === 'reflection') {
      const title = cleanText(data.get('title'));
      const body = cleanHtml(cleanText(data.get('body')));
      const categoryId = cleanText(data.get('categoryId')) || null;

      if (!title || !body) {
        return fail(400, { message: 'errors.fillAllFields' });
      }

      await prisma.reflection.update({
        where: { id },
        data: {
          title,
          body,
          categoryId,
          status: isModerator ? item.status : 'PENDING'
        }
      });
    }

    await audit({
      actorId: event.locals.user.id,
      action: 'update',
      entity: type,
      entityId: id,
      ipAddress: event.getClientAddress()
    });

    if (isModerator) {
      throw redirect(303, '/admin/content');
    } else {
      throw redirect(303, '/admin/my-content');
    }
  }
};
