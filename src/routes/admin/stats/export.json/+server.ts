import { json, redirect } from '@sveltejs/kit';
import { canAdmin } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';

export async function GET(event) {
  if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
  const data = {
    exportedAt: new Date().toISOString(),
    users: await prisma.user.findMany({ select: { id: true, email: true, name: true, suspended: true, role: true, createdAt: true } }),
    contributions: await prisma.contribution.findMany({ include: { media: true, category: true } }),
    articles: await prisma.article.findMany(),
    reflections: await prisma.reflection.findMany(),
    media: await prisma.mediaFile.findMany(),
    forms: await prisma.citizenForm.findMany({ include: { fields: true, responses: true } }),
    surveys: await prisma.survey.findMany({ include: { options: true, responses: true } }),
    collections: await prisma.collection.findMany({ include: { items: true } }),
    settings: await prisma.siteSetting.findMany(),
    auditLogs: await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })
  };
  await audit({ actorId: event.locals.user?.id, action: 'export', entity: 'system', ipAddress: event.getClientAddress() });
  return json(data);
}
