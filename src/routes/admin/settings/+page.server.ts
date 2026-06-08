import { fail, redirect } from '@sveltejs/kit';
import { assertCsrf } from '$lib/auth/csrf';
import { canAdmin } from '$lib/auth/permissions';
import { getHomeSettings, setHomeSettings } from '$lib/cms/site';
import { prisma } from '$lib/db/prisma';
import { audit } from '$lib/server/audit';
import { cleanText } from '$lib/server/sanitize';

export async function load({ locals }) {
  if (!canAdmin(locals.user?.role.level)) throw redirect(303, '/admin');
  const [home, menu] = await Promise.all([
    getHomeSettings(),
    prisma.menuItem.findMany({ orderBy: { position: 'asc' } })
  ]);
  return { home, menu };
}

export const actions = {
  home: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const home = {
      causeName: cleanText(data.get('causeName')),
      heroImageUrl: cleanText(data.get('heroImageUrl')),
      heroImageAlt: cleanText(data.get('heroImageAlt')),
      problemSummary: cleanText(data.get('problemSummary')),
      callToAction: cleanText(data.get('callToAction'))
    };
    if (!home.causeName || !home.heroImageUrl || !home.problemSummary || !home.callToAction) {
      return fail(400, { message: 'Completa la configuración de portada.' });
    }
    await setHomeSettings(home);
    await audit({ actorId: event.locals.user?.id, action: 'update', entity: 'site_settings', entityId: 'home', ipAddress: event.getClientAddress() });
    return { message: 'Portada actualizada.' };
  },
  menu: async (event) => {
    if (!canAdmin(event.locals.user?.role.level)) throw redirect(303, '/admin');
    const data = await event.request.formData();
    assertCsrf(event, data);
    const id = cleanText(data.get('id'));
    const payload = {
        label: cleanText(data.get('label')),
        href: cleanText(data.get('href')),
        position: Number(cleanText(data.get('position')) || 0),
        visible: data.get('visible') === 'on'
      };
    if (!payload.label || !payload.href) return fail(400, { message: 'Completa etiqueta y URL del menú.' });
    const item = id
      ? await prisma.menuItem.update({ where: { id }, data: payload })
      : await prisma.menuItem.create({ data: payload });
    await audit({ actorId: event.locals.user?.id, action: 'upsert', entity: 'menu_item', entityId: item.id, ipAddress: event.getClientAddress() });
    return { message: 'Menú actualizado.' };
  }
};
