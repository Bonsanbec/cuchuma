import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canModerate } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText, slugify } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canModerate(locals.user?.role.level)) throw redirect(303, '/admin');
  const surveys = await prisma.survey.findMany({
    include: { options: { include: { _count: { select: { responses: true } } } }, _count: { select: { responses: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return { surveys };
}

export const actions = {
  create: async (event) => {
    if (!canModerate(event.locals.user?.role.level) || !event.locals.user) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const title = cleanText(data.get('title'));
    const options = cleanText(data.get('options')).split('\n').map((item) => item.trim()).filter(Boolean);
    if (!title || options.length < 2) return fail(400, { message: 'La encuesta necesita título y al menos dos opciones.' });
    const survey = await prisma.survey.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        question: cleanText(data.get('question')),
        resultsPublic: data.get('resultsPublic') === 'on',
        active: data.get('active') === 'on',
        createdById: event.locals.user.id,
        options: { create: options.map((label, index) => ({ label, position: index + 1 })) }
      }
    });
    await audit({ actorId: event.locals.user.id, action: 'create', entity: 'survey', entityId: survey.id, ipAddress: event.getClientAddress() });
    return { message: 'Encuesta creada.' };
  },
  toggle: async (event) => {
    if (!canModerate(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const survey = await prisma.survey.update({
      where: { id: cleanText(data.get('id')) },
      data: { active: data.get('active') === 'on', resultsPublic: data.get('resultsPublic') === 'on' }
    });
    await audit({ actorId: event.locals.user?.id, action: 'toggle', entity: 'survey', entityId: survey.id, ipAddress: event.getClientAddress() });
    return { message: 'Encuesta actualizada.' };
  }
};
