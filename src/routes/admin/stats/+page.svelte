<script lang="ts">
  let { data } = $props();
  let entries = $derived(Object.entries(data.stats).filter(([key]) => key !== 'auditLogs'));
</script>

<section class="section">
  <h1>Estadísticas y auditoría</h1>
  <a class="button" href="/admin/stats/export.json">Exportar datos</a>
  <div class="admin-grid">
    {#each entries as [label, value]}
      <div class="card"><h2>{value}</h2><p class="meta">{label}</p></div>
    {/each}
  </div>
  <h2>Auditoría reciente</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Fecha</th><th>Actor</th><th>Acción</th><th>Entidad</th></tr></thead>
      <tbody>{#each data.stats.auditLogs as log}<tr><td>{new Date(log.createdAt).toLocaleString('es-MX')}</td><td>{log.actor?.email ?? 'Sistema'}</td><td>{log.action}</td><td>{log.entity} {log.entityId ?? ''}</td></tr>{/each}</tbody>
    </table>
  </div>
</section>
