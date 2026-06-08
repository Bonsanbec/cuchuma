import { json, redirect } from '@sveltejs/kit';
import { canAdmin } from '$lib/auth/permissions';
import { prisma } from '$lib/db/prisma';

async function collectStats() {
  const [
    users,
    contributions,
    pending,
    media,
    articles,
    reflections,
    forms,
    formResponses,
    surveys,
    surveyResponses,
    collections,
    auditLogs
  ] = await Promise.all([
    prisma.user.count(),
    prisma.contribution.count(),
    prisma.contribution.count({ where: { status: 'PENDING' } }),
    prisma.mediaFile.count(),
    prisma.article.count(),
    prisma.reflection.count(),
    prisma.citizenForm.count(),
    prisma.formResponse.count(),
    prisma.survey.count(),
    prisma.surveyResponse.count(),
    prisma.collection.count(),
    prisma.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: 'desc' }, take: 100 })
  ]);
  return { users, contributions, pending, media, articles, reflections, forms, formResponses, surveys, surveyResponses, collections, auditLogs };
}

export async function load({ locals }) {
  if (!canAdmin(locals.user?.role.level)) throw redirect(303, '/admin');
  return { stats: await collectStats() };
}
