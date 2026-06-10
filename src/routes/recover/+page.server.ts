import { fail } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { sendMail } from '$lib/server/mail';
import { createToken, sha256 } from '$lib/server/crypto';
import { audit } from '$lib/server/audit';
import { translate } from '$lib/i18n';

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    assertCsrf(event, data);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.suspended) {
      return { message: 'auth.recoveryLinkGenerated' };
    }
    const token = createToken();
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: sha256(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });
    await audit({ actorId: user.id, action: 'password_reset_requested', entity: 'user', entityId: user.id, ipAddress: event.getClientAddress() });
    const baseUrl = process.env.PUBLIC_SITE_URL || event.url.origin;
    const sent = await sendMail({
      to: user.email,
      subject: translate('auth.resetPasswordSubject'),
      html: translate('auth.resetPasswordBody', { url: `${baseUrl}/reset/${token}` })
    });
    if (!sent && process.env.NODE_ENV !== 'production') {
      return { message: 'auth.localRecoveryLink', params: { token } };
    }
    return { message: 'auth.recoveryLinkSent' };
  }
};

