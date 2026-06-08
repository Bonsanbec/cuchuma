<script lang="ts">
  let { data } = $props();
</script>

<main>
  {#if data.collection}
    <h1>{data.collection.title}</h1>
    <p class="lead">{data.collection.description}</p>
    <div class="grid">
      {#each data.collection.items as item}
        <article class="card">
          <h2>{item.contribution.title}</h2>
          <p class="meta">{item.contribution.category?.name ?? 'Sin categoría'}</p>
          <p>{@html item.contribution.body}</p>
        </article>
      {:else}
        <p class="notice">Esta colección todavía no tiene contenidos.</p>
      {/each}
    </div>
  {:else}
    <h1>Colección no disponible</h1>
  {/if}
</main>
