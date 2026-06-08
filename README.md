Nombre del proyecto

Portal de Defensa y Documentación de El Cuchumá.

Objetivo del MVP

Desarrollar un portal web público que funcione como volante digital, archivo documental y punto central de participación ciudadana para la defensa y documentación de El Cuchumá. El sistema deberá priorizar el acceso inmediato a información relevante sin requerir registro, privilegiando la experiencia móvil y permitiendo la administración completa desde una interfaz web para usuarios no técnicos.

Audiencia objetivo

* Ciudadanía general interesada en El Cuchumá.
* Personas que reciben información mediante volantes físicos y códigos QR.
* Habitantes de Tecate.
* Periodistas e investigadores.
* Integrantes del movimiento de defensa.
* Colaboradores voluntarios.

⸻

Requerimientos funcionales

RF-001. Página principal tipo volante digital

Al ingresar al sitio, el visitante deberá visualizar la información esencial sin necesidad de desplazarse ni iniciar sesión.

La pantalla inicial deberá mostrar:

* Nombre de la causa.
* Imagen principal de El Cuchumá.
* Resumen breve del problema actual.
* Llamado a la acción.
* Acceso visible a:
    * Evidencias.
    * Recuerdos.
    * Archivo documental.
    * Formularios activos.
    * Encuestas activas.

Criterio de aceptación: Toda la información crítica debe ser visible en la primera pantalla de un dispositivo móvil estándar.

⸻

RF-002. Archivo documental público

El sistema deberá permitir consultar material histórico y documental relacionado con El Cuchumá.

Tipos de contenido:

* Fotografías.
* Videos.
* Audios.
* Documentos PDF.
* Artículos periodísticos.
* Testimonios escritos.

Criterio de aceptación: Un visitante puede navegar el contenido sin registrarse ni descargar archivos.

⸻

RF-003. Sistema de contribuciones ciudadanas

Los usuarios con permisos adecuados podrán agregar contenido.

Cada contribución deberá clasificarse como:

* Recuerdo.
* Evidencia.

Cada contribución podrá incluir:

* Texto.
* Fotografías.
* Video.
* Audio.
* Documentos.
* Enlaces externos.

Criterio de aceptación: El contenido queda pendiente de moderación antes de hacerse público.

⸻

RF-004. Gestión de notas periodísticas

Los usuarios autorizados podrán registrar notas periodísticas relacionadas.

Cada registro deberá incluir:

* Título.
* Medio.
* Autor (opcional).
* Fecha.
* URL.
* Resumen.

⸻

RF-005. Publicación de reflexiones y documentación

Los usuarios autorizados podrán publicar contenido textual adicional.

Ejemplos:

* Ensayos.
* Opiniones.
* Cronologías.
* Análisis.
* Informes.

⸻

RF-006. Formularios ciudadanos

Los miembros podrán crear formularios sin intervención técnica.

Ejemplos:

* Recolección de testimonios.
* Registro de voluntarios.
* Solicitudes de información.

Campos configurables:

* Texto corto.
* Texto largo.
* Correo electrónico.
* Selección única.
* Selección múltiple.
* Adjuntos.

⸻

RF-007. Encuestas rápidas

Los miembros podrán crear encuestas públicas.

Características:

* Pregunta única.
* Opciones múltiples.
* Resultados visibles o privados.

⸻

RF-008. Colecciones temáticas

Los miembros podrán agrupar contribuciones relacionadas en una sola vista.

Ejemplos:

* Impacto del muro.
* Historia cultural.
* Flora y fauna.
* Evidencia fotográfica.

⸻

RF-009. Búsqueda

Los visitantes deberán poder buscar contenido mediante:

* Palabras clave.
* Tipo de contenido.
* Fecha.
* Categoría.

⸻

RF-010. Sistema de autenticación

El sistema deberá permitir:

* Inicio de sesión.
* Recuperación de contraseña.
* Cierre de sesión.

No se requiere registro público en el MVP.

Las cuentas serán creadas por administradores.

⸻

Requerimientos de roles

Los permisos serán acumulativos.

Contribuidor

Puede:

* Crear contribuciones.
* Adjuntar multimedia.
* Registrar notas periodísticas.
* Publicar reflexiones.
* Editar sus propios contenidos mientras no hayan sido moderados.

⸻

Miembro

Incluye todos los permisos de Contribuidor.

Además puede:

* Aprobar o rechazar contenido.
* Editar contenido público.
* Crear formularios.
* Crear encuestas.
* Crear colecciones temáticas.
* Gestionar categorías.

⸻

Administrador

Incluye todos los permisos anteriores.

Además puede:

* Crear usuarios.
* Modificar roles.
* Suspender usuarios.
* Configurar apariencia.
* Configurar estructura de la página principal.
* Consultar estadísticas.
* Exportar datos.
* Acceder a todo el contenido del sistema.

⸻

Requerimientos de administración

RF-011. CMS autogestionable

Toda la administración deberá realizarse desde la interfaz web.

No deberá requerirse:

* Acceso SSH.
* Edición manual de archivos.
* Modificación de código.

Un administrador podrá modificar:

* Textos principales.
* Imágenes destacadas.
* Menús.
* Formularios.
* Encuestas.
* Categorías.
* Contenido de portada.

⸻

Requerimientos de identidad visual

RF-012. Origen de recursos gráficos

El sistema deberá utilizar únicamente:

* Material histórico obtenido de fuentes previas a 2021.
* Material aportado por usuarios.
* Material fotográfico documental.

No deberán utilizarse imágenes generadas mediante IA.

⸻

Requerimientos no funcionales

RNF-001. Mobile First

La interfaz deberá diseñarse inicialmente para teléfonos móviles.

Resolución mínima objetivo:

* 360 × 640 px.

⸻

RNF-002. Responsividad

El sistema deberá funcionar correctamente en:

* Smartphones.
* Tablets.
* Computadoras de escritorio.

⸻

RNF-003. Accesibilidad

Deberá incluir:

* Contraste adecuado.
* Texto escalable.
* Navegación mediante teclado.
* Etiquetas accesibles para lectores de pantalla.

⸻

RNF-004. Rendimiento

La portada deberá cargar en menos de 3 segundos sobre conexión móvil 4G.

⸻

RNF-005. SEO

La información pública deberá ser indexable por motores de búsqueda.

⸻

RNF-006. Seguridad

* Contraseñas cifradas.
* Protección CSRF.
* Protección XSS.
* Control de permisos basado en roles.
* Registro de auditoría de acciones administrativas.

⸻

Arquitectura propuesta

Frontend:

* SvelteKit.
* TypeScript.
* Mobile First.

Backend:

* SvelteKit Adapter Node.
* API integrada.

Base de datos:

* PostgreSQL.

Almacenamiento:

* Sistema de archivos local o almacenamiento compatible con S3.

Autenticación:

* Session-based authentication.

Servidor:

* Apache como reverse proxy.
* Node.js.
* Let’s Encrypt.

Dominio:

* cuchuma.bonsanbec.dev

⸻

Alcance exacto del MVP

* Página principal tipo volante digital.
* Archivo documental público.
* Sistema de contribuciones.
* Moderación.
* Roles.
* CMS básico.
* Búsqueda.
* Administración de usuarios.
* Estadísticas básicas.