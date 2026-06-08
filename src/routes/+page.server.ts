import { prisma } from '$lib/db/prisma';
import { getHomeSettings } from '$lib/cms/site';

export async function load() {
  const [home, forms, surveys, collections, latest] = await Promise.all([
    getHomeSettings(),
    prisma.citizenForm.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.survey.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.collection.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 3 }),
    prisma.contribution.findMany({
      where: { status: 'APPROVED' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true }
    })
  ]);
  return { home, forms, surveys, collections, latest };
}
