<script lang="ts">
  let { data } = $props();
</script>

<main>
  <h1>Archivo documental</h1>
  <form class="filters" method="GET">
    <label>Palabras clave
      <input name="q" value={data.filters.q ?? ''} />
    </label>
    <label>Tipo
      <select name="type">
        <option value="">Todo</option>
        <option value="EVIDENCE" selected={data.filters.type === 'EVIDENCE'}>Evidencias</option>
        <option value="MEMORY" selected={data.filters.type === 'MEMORY'}>Recuerdos</option>
      </select>
    </label>
    <label>Categoría
      <select name="category">
        <option value="">Todas</option>
        {#each data.categories as category}
          <option value={category.id} selected={data.filters.category === category.id}>{category.name}</option>
        {/each}
      </select>
    </label>
    <label>Desde
      <input type="date" name="from" value={data.filters.from ?? ''} />
    </label>
    <button type="submit">Buscar</button>
  </form>

  <section class="section">
    <h2>Contribuciones</h2>
    <div class="grid">
      {#each data.contributions as item}
        <article class="card">
          <h3>{item.title}</h3>
          <p class="meta">{item.type === 'EVIDENCE' ? 'Evidencia' : 'Recuerdo'} · {item.category?.name ?? 'Sin categoría'}</p>
          <p>{@html item.body}</p>
          {#if item.media.length}
            <p class="meta">{item.media.length} archivo(s) multimedia</p>
          {/if}
        </article>
      {:else}
        <p class="notice">No se encontraron contribuciones aprobadas.</p>
      {/each}
    </div>
  </section>

  <section class="section">
    <h2>Multimedia</h2>
    <div class="grid">
      {#each data.media as file}
        <article class="card">
          <h3>{file.title}</h3>
          <p class="meta">{file.kind} · {file.mimeType} · {Math.round(file.sizeBytes / 1024)} KB</p>
          {#if file.kind === 'IMAGE'}<img src={file.publicUrl} alt={file.altText ?? file.title} width="320" loading="lazy" />{/if}
          {#if file.kind === 'VIDEO'}<video src={file.publicUrl} controls preload="metadata"><track kind="captions" /></video>{/if}
          {#if file.kind === 'AUDIO'}<audio src={file.publicUrl} controls></audio>{/if}
          {#if file.kind === 'DOCUMENT'}<a href={file.publicUrl} target="_blank" rel="noreferrer">Ver documento</a>{/if}
        </article>
      {:else}
        <p class="notice">No hay archivos multimedia publicados.</p>
      {/each}
    </div>
  </section>

  <section class="section">
    <h2>Notas periodísticas</h2>
    <div class="grid">
      {#each data.articles as article}
        <article class="card">
          <h3><a href={article.url} rel="noreferrer" target="_blank">{article.title}</a></h3>
          <p class="meta">{article.outlet} · {new Date(article.publishedOn).toLocaleDateString('es-MX')}</p>
          <p>{article.summary}</p>
        </article>
      {:else}
        <p class="notice">No hay notas aprobadas.</p>
      {/each}
    </div>
  </section>

  <section class="section">
    <h2>Reflexiones y documentación</h2>
    <div class="grid">
      {#each data.reflections as reflection}
        <article class="card">
          <h3>{reflection.title}</h3>
          <p>{@html reflection.body}</p>
        </article>
      {:else}
        <p class="notice">No hay publicaciones textuales aprobadas.</p>
      {/each}
    </div>
  </section>
</main>
