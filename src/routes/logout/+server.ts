import { redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { destroySession } from '$lib/auth/session';
import { audit } from '$lib/server/audit';

export async function POST(event) {
  const data = await event.request.formData();
  assertCsrf(event, data);
  await audit({ actorId: event.locals.user?.id, action: 'logout', entity: 'user', entityId: event.locals.user?.id, ipAddress: event.getClientAddress() });
  await destroySession(event.cookies);
  throw redirect(303, '/');
}
