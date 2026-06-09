import { prisma } from '$lib/db/prisma';
import { getHomeSettings } from '$lib/cms/site';
import esJson from '$lib/i18n/locales/es.json';

export async function load({ locals, url }) {
  const [menu, site, pendingContentCount, pendingRequestsCount] = await Promise.all([
    prisma.menuItem.findMany({ where: { visible: true }, orderBy: { position: 'asc' } }),
    getHomeSettings(),
    locals.user
      ? Promise.all([
          prisma.contribution.count({ where: { status: 'PENDING' } }),
          prisma.article.count({ where: { status: 'PENDING' } }),
          prisma.reflection.count({ where: { status: 'PENDING' } })
        ]).then(([c, a, r]) => c + a + r)
      : Promise.resolve(0),
    locals.user && locals.user.role.level === 'ADMIN'
      ? prisma.accessRequest.count({ where: { status: 'PENDING' } })
      : Promise.resolve(0)
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
    dictionary,
    pendingContentCount,
    pendingRequestsCount
  };
}

