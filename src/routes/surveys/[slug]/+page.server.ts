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
    const clientIpHash = hashIp(event.getClientAddress());
    const cookieName = `cuchuma_survey_${survey.slug}`;

    // Validate if already voted
    if (event.locals.user) {
      const existing = await prisma.surveyResponse.findFirst({
        where: { surveyId: survey.id, userId: event.locals.user.id }
      });
      if (existing) {
        return fail(400, { message: 'surveys.ipVoted' });
      }
    } else {
      if (event.cookies.get(cookieName) === 'voted') {
        return fail(400, { message: 'surveys.ipVoted' });
      }
      const existing = await prisma.surveyResponse.findFirst({
        where: { surveyId: survey.id, ipHash: clientIpHash }
      });
      if (existing) {
        return fail(400, { message: 'surveys.ipVoted' });
      }
    }

    await prisma.surveyResponse.create({
      data: {
        surveyId: survey.id,
        optionId,
        ipHash: clientIpHash,
        userId: event.locals.user?.id || null
      }
    });

    // Set cookie to prevent subsequent anonymous votes
    event.cookies.set(cookieName, 'voted', {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return { message: 'surveys.voteRegistered' };
  }
};
