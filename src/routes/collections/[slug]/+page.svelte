<script lang="ts">
  let { data } = $props();
</script>

<main>
  {#if data.collection}
    <section class="story-hero" aria-labelledby="collection-title">
      <div>
        <p class="eyebrow">Recorrido temático</p>
        <h1 id="collection-title">{data.collection.title}</h1>
        <p class="lead">{data.collection.description}</p>
        <p><a class="button secondary" href="/archive">Volver al archivo</a></p>
      </div>
      <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" />
    </section>
    <section class="section">
      <p class="eyebrow">Material reunido</p>
      <h2>Una lectura posible.</h2>
      <div class="timeline">
      {#each data.collection.items as item}
        <article>
          <p class="meta">{item.contribution.category?.name ?? 'Registro público'}</p>
          <h3>{item.contribution.title}</h3>
          <p>{@html item.contribution.body}</p>
        </article>
      {:else}
        <p class="notice">Esta colección todavía no tiene contenidos.</p>
      {/each}
      </div>
    </section>
  {:else}
    <h1>Colección no disponible</h1>
  {/if}
</main>
