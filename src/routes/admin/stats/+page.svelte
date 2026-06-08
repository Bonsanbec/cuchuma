<script lang="ts">
  import { t } from '$lib/i18n';
  let { data } = $props();
  let entries = $derived(Object.entries(data.stats).filter(([key]) => key !== 'auditLogs'));
</script>

<section class="section">
  <h1>{$t('admin.stats.title')}</h1>
  <a class="button" href="/admin/stats/export.json">{$t('admin.stats.export')}</a>
  <div class="admin-grid">
    {#each entries as [label, value]}
      <div class="card"><h2>{value}</h2><p class="meta">{$t('admin.dashboard.stats.' + label)}</p></div>
    {/each}
  </div>
  <h2>{$t('admin.stats.recentAuditLogs')}</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>{$t('admin.content.table.date')}</th>
          <th>{$t('admin.stats.actorColumn')}</th>
          <th>{$t('admin.users.actionColumn')}</th>
          <th>{$t('admin.stats.entityColumn')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.stats.auditLogs as log}
          <tr>
            <td>{new Date(log.createdAt).toLocaleString('es-MX')}</td>
            <td>{log.actor?.email ?? $t('admin.stats.systemActor')}</td>
            <td>{log.action}</td>
            <td>{log.entity} {log.entityId ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

