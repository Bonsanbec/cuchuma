import { prisma } from '$lib/db/prisma';

export async function load({ url }) {
  const q = url.searchParams.get('q')?.trim();
  const type = url.searchParams.get('type') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const from = url.searchParams.get('from') || undefined;

  const [categories, contributions, articles, reflections, media, collections, memories] = await Promise.all([
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
    }),
    prisma.collection.findMany({
      where: { published: true },
      include: { items: { take: 3, include: { contribution: true } } },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.contribution.findMany({
      where: { status: 'APPROVED', type: 'MEMORY' },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 6
    })
  ]);

  const timeline = [
    ...contributions.map((item) => ({
      kind: item.type === 'MEMORY' ? 'Memoria compartida' : 'Registro documentado',
      title: item.title,
      text: item.body,
      date: item.publishedAt ?? item.createdAt,
      category: item.category?.name,
      url: undefined as string | undefined
    })),
    ...articles.map((item) => ({
      kind: 'Nota periodística',
      title: item.title,
      text: item.summary,
      date: item.publishedOn,
      category: item.outlet,
      url: item.url
    })),
    ...reflections.map((item) => ({
      kind: 'Lectura de contexto',
      title: item.title,
      text: item.body,
      date: item.publishedAt ?? item.createdAt,
      category: item.category?.name,
      url: undefined as string | undefined
    }))
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12);

  return { categories, contributions, articles, reflections, media, collections, memories, timeline, filters: { q, type, category, from } };
}
