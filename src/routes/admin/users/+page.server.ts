import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canAdmin } from '$lib/auth/permissions';
import { hashPassword } from '$lib/auth/password';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText } from '$lib/server/sanitize';
import { createToken, sha256 } from '$lib/server/crypto';
import { sendMail } from '$lib/server/mail';
import { translate } from '$lib/i18n';

export async function load({ locals }) {
  if (!canAdmin(locals.user?.role.level)) throw redirect(303, '/admin');
  const [users, roles, requests] = await Promise.all([
    prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } }),
    prisma.role.findMany({ orderBy: { level: 'asc' } }),
    prisma.accessRequest.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } })
  ]);
  return { users, roles, requests };
}

export const actions = {
  create: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const email = cleanText(data.get('email')).toLowerCase();
    const name = cleanText(data.get('name'));
    const password = cleanText(data.get('password'));
    const roleId = cleanText(data.get('roleId'));
    if (!email || !name || password.length < 12 || !roleId) return fail(400, { message: 'errors.fillAllFields' });
    const user = await prisma.user.create({ data: { email, name, roleId, passwordHash: await hashPassword(password) } });
    await audit({ actorId: event.locals.user?.id, action: 'create', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.saved' };
  },
  update: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const id = cleanText(data.get('id'));
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: cleanText(data.get('name')),
        roleId: cleanText(data.get('roleId')),
        suspended: data.get('suspended') === 'on'
      }
    });
    await audit({ actorId: event.locals.user?.id, action: 'update', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    return { message: 'notifications.updated' };
  },
  approveRequest: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    
    const requestId = cleanText(data.get('requestId'));
    const roleId = cleanText(data.get('roleId'));
    if (!requestId || !roleId) return fail(400, { message: 'errors.fillAllFields' });

    const request = await prisma.accessRequest.findUnique({ where: { id: requestId } });
    if (!request || request.status !== 'PENDING') return fail(404, { message: 'errors.notFound' });

    // Verify user doesn't already exist
    const userExists = await prisma.user.findUnique({ where: { email: request.email } });
    if (userExists) {
      await prisma.accessRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
      return fail(400, { message: 'errors.emailAlreadyRegistered' });
    }

    // Create user with random temporary password hash
    const tempPassword = createToken();
    const newUser = await prisma.user.create({
      data: {
        email: request.email,
        name: request.name,
        roleId,
        passwordHash: await hashPassword(tempPassword)
      }
    });

    // Generate password reset token
    const token = createToken();
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: sha256(token),
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' }
    });

    await audit({
      actorId: event.locals.user?.id,
      action: 'approve_request',
      entity: 'access_request',
      entityId: requestId,
      ipAddress: event.getClientAddress()
    });

    const baseUrl = process.env.PUBLIC_SITE_URL || event.url.origin;
    const resetUrl = `${baseUrl}/reset/${token}`;

    // Try sending email
    await sendMail({
      to: newUser.email,
      subject: translate('auth.resetPasswordSubject'),
      text: translate('auth.resetPasswordBody', { url: resetUrl })
    });

    return {
      message: 'admin.users.approvedWithToken',
      params: { url: resetUrl }
    };
  },
  rejectRequest: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);

    const requestId = cleanText(data.get('requestId'));
    if (!requestId) return fail(400, { message: 'errors.fillAllFields' });

    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });

    await audit({
      actorId: event.locals.user?.id,
      action: 'reject_request',
      entity: 'access_request',
      entityId: requestId,
      ipAddress: event.getClientAddress()
    });

    return { message: 'admin.users.rejected' };
  }
};
