import { fail } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { cleanText } from '$lib/server/sanitize';

export async function load({ locals }) {
  return { csrf: locals.csrf };
}

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    assertCsrf(event, data);

    const name = cleanText(data.get('name'));
    const email = cleanText(data.get('email')).trim().toLowerCase();
    const motivation = cleanText(data.get('motivation'));

    if (!name || !email || !motivation) {
      return fail(400, { message: 'errors.fillAllFields' });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { message: 'validation.email' });
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return fail(400, { message: 'errors.emailAlreadyRegistered' });
    }

    // Check if a pending request already exists
    const requestExists = await prisma.accessRequest.findFirst({
      where: { email, status: 'PENDING' }
    });
    if (requestExists) {
      return fail(400, { message: 'errors.requestAlreadyPending' });
    }

    // Delete any old approved/rejected request for this email to bypass the unique constraint
    await prisma.accessRequest.deleteMany({
      where: { email }
    });

    // Create the access request
    await prisma.accessRequest.create({
      data: { name, email, motivation, status: 'PENDING' }
    });

    return { message: 'auth.requestAccessSuccess' };
  }
};
