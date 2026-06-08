import { prisma } from '$lib/db/prisma';

export async function load({ url }) {
  const q = url.searchParams.get('q')?.trim();
  const type = url.searchParams.get('type') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const from = url.searchParams.get('from') || undefined;

  const [categories, contributions, articles, reflections, media] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.contribution.findMany({
      where: {
        status: 'APPROVED',
        ...(type === 'MEMORY' || type === 'EVIDENCE' ? { type } : {}),
        ...(category ? { categoryId: category } : {}),
        ...(from ? { createdAt: { gte: new Date(from) } } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { body: { contains: q, mode: 'insensitive' } }] } : {})
      },
      include: { category: true, media: true },
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.article.findMany({
      where: {
        status: 'APPROVED',
        ...(category ? { categoryId: category } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { summary: { contains: q, mode: 'insensitive' } }, { outlet: { contains: q, mode: 'insensitive' } }] } : {})
      },
      include: { category: true },
      orderBy: { publishedOn: 'desc' }
    }),
    prisma.reflection.findMany({
      where: {
        status: 'APPROVED',
        ...(category ? { categoryId: category } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { body: { contains: q, mode: 'insensitive' } }] } : {})
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.mediaFile.findMany({
      where: q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {},
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { categories, contributions, articles, reflections, media, filters: { q, type, category, from } };
}
