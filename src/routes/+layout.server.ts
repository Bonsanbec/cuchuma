import { prisma } from '$lib/db/prisma';
import { getHomeSettings } from '$lib/cms/site';

export async function load({ locals, url }) {
  const [menu, site] = await Promise.all([
    prisma.menuItem.findMany({ where: { visible: true }, orderBy: { position: 'asc' } }),
    getHomeSettings()
  ]);
  return {
    user: locals.user,
    csrf: locals.csrf,
    menu,
    site,
    pathname: url.pathname
  };
}
