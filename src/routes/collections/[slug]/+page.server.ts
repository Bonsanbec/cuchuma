import { prisma } from '$lib/db/prisma';

export async function load({ params }) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      items: {
        orderBy: { position: 'asc' },
        include: { contribution: { include: { category: true, media: true } } }
      }
    }
  });
  return { collection: collection?.published ? collection : null };
}
