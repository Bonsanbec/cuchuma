<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Colecciones temáticas</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Título <input name="title" required /></label>
    <label>Descripción <textarea name="description" required></textarea></label>
    <label><span><input type="checkbox" name="published" checked /> Publicada</span></label>
    <fieldset>
      <legend>Contribuciones aprobadas</legend>
      {#each data.contributions as contribution}
        <label><span><input type="checkbox" name="contributionId" value={contribution.id} /> {contribution.title}</span></label>
      {/each}
    </fieldset>
    <button type="submit">Crear colección</button>
  </form>
  <div class="grid">
    {#each data.collections as collection}
      <article class="card">
        <h2><a href={`/collections/${collection.slug}`}>{collection.title}</a></h2>
        <p>{collection.description}</p>
        <p class="meta">{collection.published ? 'Publicada' : 'Privada'} · {collection.items.length} contenidos</p>
      </article>
    {/each}
  </div>
</section>
