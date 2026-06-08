<script lang="ts">
  let { children } = $props();
</script>

<main>
  <nav class="quicklinks" aria-label="Administración">
    <a href="/admin">Resumen</a>
    <a href="/admin/content">Contenido</a>
    <a href="/admin/media">Multimedia</a>
    <a href="/admin/forms">Formularios</a>
    <a href="/admin/surveys">Encuestas</a>
    <a href="/admin/collections">Colecciones</a>
    <a href="/admin/settings">Configuración</a>
    <a href="/admin/users">Usuarios</a>
    <a href="/admin/stats">Estadísticas</a>
  </nav>
  {@render children()}
</main>
