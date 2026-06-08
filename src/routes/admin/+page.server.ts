import { prisma } from '$lib/db/prisma';

export async function load() {
  const [pending, approved, users, media, forms, surveys] = await Promise.all([
    prisma.contribution.count({ where: { status: 'PENDING' } }),
    prisma.contribution.count({ where: { status: 'APPROVED' } }),
    prisma.user.count(),
    prisma.mediaFile.count(),
    prisma.citizenForm.count(),
    prisma.survey.count()
  ]);
  return { stats: { pending, approved, users, media, forms, surveys } };
}
