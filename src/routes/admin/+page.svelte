<script lang="ts">
  import { t } from '$lib/i18n';
  let { data } = $props();
</script>

<section class="section">
  <h1>{$t('admin.title')}</h1>
  <div class="admin-grid">
    {#each Object.entries(data.stats) as [label, value]}
      <div class="card">
        <h2>{value}</h2>
        <p class="meta">{$t('admin.dashboard.stats.' + label)}</p>
      </div>
    {/each}
  </div>
</section>

