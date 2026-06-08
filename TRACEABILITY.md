# Matriz de trazabilidad

| Requisito | Implementación |
| --- | --- |
| RF-001 Portada tipo volante | `src/routes/+page.*`, CMS en `src/lib/cms/site.ts`, configuración en `/admin/settings`. |
| RF-002 Archivo documental público | `src/routes/archive/+page.*`, consulta sin autenticación de contribuciones, multimedia, notas y reflexiones aprobadas. |
| RF-003 Contribuciones ciudadanas | `src/routes/contribute/+page.*`, modelo `Contribution`, adjuntos `MediaFile`, estado `PENDING`. |
| RF-004 Notas periodísticas | `/admin/content`, modelo `Article`, moderación y publicación. |
| RF-005 Reflexiones/documentación | `/admin/content`, modelo `Reflection`, sanitización y moderación. |
| RF-006 Formularios ciudadanos | `/admin/forms`, `src/routes/forms/[slug]`, modelos `CitizenForm`, `FormField`, `FormResponse`. |
| RF-007 Encuestas rápidas | `/admin/surveys`, `src/routes/surveys/[slug]`, modelos `Survey`, `SurveyOption`, `SurveyResponse`. |
| RF-008 Colecciones temáticas | `/admin/collections`, `src/routes/collections/[slug]`, modelos `Collection`, `CollectionItem`. |
| RF-009 Búsqueda | Filtros de `/archive` por palabra clave, tipo, fecha y categoría. |
| RF-010 Autenticación | `/login`, `/logout`, `/recover`, `/reset/[token]`, sesiones persistentes en `Session`. |
| Roles acumulativos | `src/lib/auth/permissions.ts`, guardas en rutas admin, roles seed. |
| RF-011 CMS autogestionable | Panel `/admin` para usuarios, contenido, multimedia, formularios, encuestas, colecciones, configuración y estadísticas. |
| RF-012 Recursos gráficos | Portada configurable desde CMS; cargas restringidas a material aportado/documental por usuarios autorizados. |
| RNF-001 Mobile first | CSS base en `src/styles.css`, primera pantalla optimizada para 360x640. |
| RNF-002 Responsividad | Media queries y grids fluidos en `src/styles.css`. |
| RNF-003 Accesibilidad | Semántica HTML, labels, navegación teclado, textos alternativos configurables. |
| RNF-004 Rendimiento | Renderizado server-side, portada ligera, carga diferida de medios no críticos. |
| RNF-005 SEO | SSR público, metadatos globales en `+layout.svelte`. |
| RNF-006 Seguridad | bcrypt, sesiones httpOnly, CSRF, sanitización HTML, RBAC, auditoría y cabeceras de seguridad. |
| PostgreSQL/Prisma | `prisma/schema.prisma`, `prisma/migrations/0001_initial/migration.sql`. |
| Almacenamiento local/S3 futuro | `src/lib/storage/index.ts`, variables `STORAGE_DRIVER`, `LOCAL_STORAGE_*`. |
| Apache/Node/Let's Encrypt | `deploy/apache-cuchuma.conf`, `deploy/cuchuma.service`, `deploy/README-production.md`. |
| Datos semilla mínimos | `prisma/seed.ts`. |
| Exportación de datos | `/admin/stats/export.json`. |
