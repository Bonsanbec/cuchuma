<script lang="ts">
  import '../styles.css';
  let { data, children } = $props();
  let isAdmin = $derived(data.pathname.startsWith('/admin'));
</script>

<svelte:head>
  <title>{data.site.causeName}</title>
  <meta name="description" content={data.site.problemSummary} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class:admin-shell={isAdmin} class="shell">
  <header class:admin-topbar={isAdmin} class="topbar">
    <a class="brand" href="/" aria-label="Ir a la portada">
      <img src="/identity/kuchumá.png" alt="" />
      <span>El Cuchumá</span>
    </a>
    {#if isAdmin}
      <nav aria-label="Navegación administrativa">
        <a href="/">Sitio público</a>
        <a href="/admin">Panel</a>
        {#if data.user}
          <form method="POST" action="/logout">
            <input type="hidden" name="csrf" value={data.csrf} />
            <button type="submit">Salir</button>
          </form>
        {/if}
      </nav>
    {:else}
      <nav aria-label="Navegación pública">
        <a href="/#que-pasa">Qué pasa</a>
        <a href="/#por-que-importa">Por qué importa</a>
        <a href="/archive">Lo documentado</a>
        <a href="/#memoria">Memoria</a>
        <a class="nav-action" href="/#ayudar">Ayudar</a>
      </nav>
    {/if}
  </header>
  {@render children()}
</div>
