import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { level: 'CONTRIBUTOR' },
      update: {},
      create: {
        name: 'Contribuidor',
        level: 'CONTRIBUTOR',
        description: 'Crea contribuciones, multimedia, notas y reflexiones pendientes de moderación.'
      }
    }),
    prisma.role.upsert({
      where: { level: 'MEMBER' },
      update: {},
      create: {
        name: 'Miembro',
        level: 'MEMBER',
        description: 'Modera contenido, administra categorías, formularios, encuestas y colecciones.'
      }
    }),
    prisma.role.upsert({
      where: { level: 'ADMIN' },
      update: {},
      create: {
        name: 'Administrador',
        level: 'ADMIN',
        description: 'Administra usuarios, roles, sitio, estadísticas, exportaciones y todo el contenido.'
      }
    })
  ]);

  const adminRole = roles.find((role) => role.level === 'ADMIN');
  if (!adminRole) throw new Error('No se pudo crear el rol administrador.');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { roleId: adminRole.id, suspended: false },
    create: {
      email: adminEmail,
      name: 'Administración El Cuchumá',
      passwordHash: await hashPassword(adminPassword),
      roleId: adminRole.id
    }
  });

  const categoryNames = [
    ['Evidencia fotográfica', 'Material visual documentado por la comunidad.'],
    ['Historia cultural', 'Memoria, testimonios y documentación histórica.'],
    ['Impacto del muro', 'Registro ciudadano de afectaciones y contexto actual.'],
    ['Flora y fauna', 'Observaciones y documentos sobre el ecosistema.']
  ];
  for (const [name, description] of categoryNames) {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    await prisma.category.upsert({
      where: { slug },
      update: { name, description },
      create: { name, slug, description }
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: 'home' },
    update: {},
    create: {
      key: 'home',
      value: {
        causeName: 'Defensa y documentación de El Cuchumá',
        heroImageUrl: '/identity/kuchumá.png',
        heroImageAlt: 'Silueta de El Cuchumá',
        problemSummary:
          'Portal ciudadano para reunir evidencias, recuerdos, notas, documentos y participación pública sobre El Cuchumá.',
        callToAction: 'Consulta el archivo, participa y ayuda a documentar.'
      }
    }
  });

  const menuItems = [
    ['Evidencias', '/archive?type=EVIDENCE', 1],
    ['Recuerdos', '/archive?type=MEMORY', 2],
    ['Archivo', '/archive', 3],
    ['Formularios', '/#forms', 4],
    ['Encuestas', '/#surveys', 5]
  ] as const;
  for (const [label, href, position] of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: `seed-${position}` },
      update: { label, href, position, visible: true },
      create: { id: `seed-${position}`, label, href, position, visible: true }
    });
  }

  await prisma.citizenForm.upsert({
    where: { slug: 'registro-de-voluntariado' },
    update: {},
    create: {
      title: 'Registro de voluntariado',
      slug: 'registro-de-voluntariado',
      description: 'Formulario público para coordinar apoyo ciudadano.',
      createdById: admin.id,
      fields: {
        create: [
          { label: 'Nombre', type: 'SHORT_TEXT', required: true, position: 1 },
          { label: 'Correo electrónico', type: 'EMAIL', required: true, position: 2 },
          { label: 'Cómo deseas apoyar', type: 'LONG_TEXT', required: true, position: 3 }
        ]
      }
    }
  });

  await prisma.survey.upsert({
    where: { slug: 'prioridad-comunitaria' },
    update: {},
    create: {
      title: 'Prioridad comunitaria',
      slug: 'prioridad-comunitaria',
      question: '¿Qué área debería documentarse con mayor urgencia?',
      resultsPublic: true,
      createdById: admin.id,
      options: {
        create: [
          { label: 'Evidencia fotográfica', position: 1 },
          { label: 'Testimonios vecinales', position: 2 },
          { label: 'Notas y documentos', position: 3 }
        ]
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'seed',
      entity: 'system',
      metadata: { adminEmail }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
