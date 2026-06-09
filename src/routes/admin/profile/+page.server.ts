import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { verifyPassword, hashPassword } from '$lib/auth/password';
import { audit } from '$lib/server/audit';
import { cleanText } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  const user = await prisma.user.findUnique({
    where: { id: locals.user.id },
    select: { name: true, email: true }
  });
  return { user, csrf: locals.csrf };
}

export const actions = {
  default: async (event) => {
    if (!event.locals.user) throw redirect(303, '/login');
    const data = await event.request.formData();
    assertCsrf(event, data);

    const name = cleanText(data.get('name'));
    const email = cleanText(data.get('email')).trim().toLowerCase();
    const currentPassword = cleanText(data.get('currentPassword'));
    const newPassword = cleanText(data.get('newPassword'));
    const confirmPassword = cleanText(data.get('confirmPassword'));

    if (!name || !email) {
      return fail(400, { message: 'errors.fillAllFields' });
    }

    const userId = event.locals.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw redirect(303, '/login');

    // Verification of password is required if changing email or setting new password
    const emailChanged = email !== user.email;
    const passwordChanging = !!newPassword;

    if (emailChanged || passwordChanging) {
      if (!currentPassword) {
        return fail(400, { message: 'errors.fillAllFields' });
      }
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        return fail(400, { message: 'errors.invalidCredentials' });
      }
    }

    // If email is changing, verify uniqueness
    if (emailChanged) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return fail(400, { message: 'validation.email' });
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return fail(400, { message: 'errors.emailAlreadyRegistered' });
      }
    }

    const updateData: { name: string; email: string; passwordHash?: string } = {
      name,
      email
    };

    if (passwordChanging) {
      if (newPassword !== confirmPassword) {
        return fail(400, { message: 'errors.passwordMismatch' });
      }
      if (newPassword.length < 12) {
        return fail(400, { message: 'errors.passwordMinLength', params: { min: 12 } });
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    await audit({
      actorId: userId,
      action: 'update_profile',
      entity: 'user',
      entityId: userId,
      ipAddress: event.getClientAddress()
    });

    return { message: 'notifications.updated' };
  }
};
