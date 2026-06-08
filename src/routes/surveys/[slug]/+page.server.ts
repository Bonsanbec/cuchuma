import { fail } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { hashIp } from '$lib/server/crypto';

export async function load({ params }) {
  const survey = await prisma.survey.findUnique({
    where: { slug: params.slug },
    include: {
      options: { orderBy: { position: 'asc' }, include: { _count: { select: { responses: true } } } },
      _count: { select: { responses: true } }
    }
  });
  return { survey };
}

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    assertCsrf(event, data);
    const optionId = String(data.get('optionId') || '');
    const survey = await prisma.survey.findUnique({
      where: { slug: event.params.slug },
      include: { options: true }
    });
    if (!survey || !survey.active) return fail(404, { message: 'surveys.notActive' });
    if (!survey.options.some((option) => option.id === optionId)) {
      return fail(400, { message: 'errors.invalidOption' });
    }
    await prisma.surveyResponse.create({
      data: {
        surveyId: survey.id,
        optionId,
        ipHash: hashIp(event.getClientAddress())
      }
    });
    return { message: 'surveys.voteRegistered' };
  }
};
