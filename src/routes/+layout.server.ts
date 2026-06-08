import { prisma } from '$lib/db/prisma';
import { getHomeSettings } from '$lib/cms/site';
import esJson from '$lib/i18n/locales/es.json';

export async function load({ locals, url }) {
  const [menu, site] = await Promise.all([
    prisma.menuItem.findMany({ where: { visible: true }, orderBy: { position: 'asc' } }),
    getHomeSettings()
  ]);

  // Map dynamic menu labels so they are integrated into the i18n dictionary.
  const menuDict: Record<string, string> = {};
  for (const item of menu) {
    menuDict[item.id] = item.label;
  }

  const dictionary = {
    ...esJson,
    cms: {
      ...esJson.cms,
      causeName: site.causeName,
      heroImageAlt: site.heroImageAlt,
      problemSummary: site.problemSummary,
      callToAction: site.callToAction
    },
    menu: menuDict
  };

  return {
    user: locals.user,
    csrf: locals.csrf,
    menu,
    site,
    pathname: url.pathname,
    dictionary
  };
}

