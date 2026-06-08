import { prisma } from '$lib/db/prisma';

export type HomeSettings = {
  causeName: string;
  heroImageUrl: string;
  heroImageAlt: string;
  problemSummary: string;
  callToAction: string;
};

const defaults: HomeSettings = {
  causeName: 'Defensa y documentación de El Cuchumá',
  heroImageUrl: '/identity/kuchumá.png',
  heroImageAlt: 'Silueta de El Cuchumá',
  problemSummary:
    'Archivo ciudadano para reunir evidencias, memorias, notas periodísticas y participación pública sobre El Cuchumá.',
  callToAction: 'Consulta, comparte y ayuda a documentar lo que ocurre.'
};

export async function getHomeSettings(): Promise<HomeSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'home' } });
  return { ...defaults, ...((setting?.value as Partial<HomeSettings> | undefined) ?? {}) };
}

export async function setHomeSettings(value: HomeSettings) {
  return prisma.siteSetting.upsert({
    where: { key: 'home' },
    create: { key: 'home', value },
    update: { value }
  });
}
