import { prisma } from '$lib/db/prisma';
import { getHomeSettings } from '$lib/cms/site';

export async function load() {
  const [home, forms, surveys, collections, latest, memories, articles, reflections, counts] = await Promise.all([
    getHomeSettings(),
    prisma.citizenForm.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.survey.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.collection.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 3 }),
    prisma.contribution.findMany({
      where: { status: 'APPROVED' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true }
    }),
    prisma.contribution.findMany({
      where: { status: 'APPROVED', type: 'MEMORY' },
      orderBy: { publishedAt: 'desc' },
      take: 2,
      include: { category: true }
    }),
    prisma.article.findMany({ where: { status: 'APPROVED' }, orderBy: { publishedOn: 'desc' }, take: 3 }),
    prisma.reflection.findMany({ where: { status: 'APPROVED' }, orderBy: { publishedAt: 'desc' }, take: 2 }),
    {
      documented: prisma.contribution.count({ where: { status: 'APPROVED' } }),
      media: prisma.mediaFile.count(),
      forms: prisma.citizenForm.count({ where: { active: true } })
    }
  ]);
  return { home, forms, surveys, collections, latest, memories, articles, reflections, counts: { documented: await counts.documented, media: await counts.media, forms: await counts.forms } };
}
