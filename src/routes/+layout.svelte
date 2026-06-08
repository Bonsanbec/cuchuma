<script lang="ts">
  import '../styles.css';
  let { data, children } = $props();
</script>

<svelte:head>
  <title>{data.site.causeName}</title>
  <meta name="description" content={data.site.problemSummary} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Ir a la portada">{data.site.causeName}</a>
    <nav aria-label="Navegación principal">
      {#each data.menu as item}
        <a href={item.href}>{item.label}</a>
      {/each}
      {#if data.user}
        <a href="/admin">Admin</a>
        <form method="POST" action="/logout">
          <input type="hidden" name="csrf" value={data.csrf} />
          <button type="submit">Salir</button>
        </form>
      {:else}
        <a href="/login">Entrar</a>
      {/if}
    </nav>
  </header>
  {@render children()}
</div>
