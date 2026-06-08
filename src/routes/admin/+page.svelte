<script lang="ts">
  let { data } = $props();
</script>

<section class="section">
  <h1>Panel administrativo</h1>
  <div class="admin-grid">
    {#each Object.entries(data.stats) as [label, value]}
      <div class="card">
        <h2>{value}</h2>
        <p class="meta">{label}</p>
      </div>
    {/each}
  </div>
</section>
