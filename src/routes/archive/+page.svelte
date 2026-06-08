<script lang="ts">
  let { data } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="archive-title">
    <div>
      <p class="eyebrow">Archivo vivo de El Cuchumá</p>
      <h1 id="archive-title">Lo documentado no empieza en un buscador.</h1>
      <p class="lead">Empieza con una pregunta sencilla: qué se sabe, quién lo recuerda y qué material existe para sostener esa memoria.</p>
      <div class="hero-actions">
        <a class="button" href="#linea-tiempo">Ver cronología</a>
        <a class="button secondary" href="#recorridos">Explorar recorridos</a>
      </div>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" />
  </section>

  <section class="section" id="recorridos" aria-labelledby="routes-title">
    <p class="eyebrow">Recorridos para empezar</p>
    <h2 id="routes-title">Entrar por historias.</h2>
    <div class="story-grid">
      {#each data.collections as collection}
        <a class="story-panel" href={`/collections/${collection.slug}`}>
          <p class="meta">{collection.items.length} registros relacionados</p>
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </a>
      {:else}
        <article class="story-panel">
          <p class="meta">Archivo en organización</p>
          <h3>Las rutas temáticas aparecerán conforme el equipo las publique.</h3>
          <p>Mientras tanto, la cronología permite leer el material aprobado más reciente.</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="section" id="linea-tiempo" aria-labelledby="timeline-title">
    <p class="eyebrow">Qué está ocurriendo ahora</p>
    <h2 id="timeline-title">Cronología pública.</h2>
    <div class="timeline">
      {#each data.timeline as item}
        <article>
          <p class="meta">{new Date(item.date).toLocaleDateString('es-MX')} · {item.kind}{item.category ? ` · ${item.category}` : ''}</p>
          <h3>{#if item.url}<a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>{:else}{item.title}{/if}</h3>
          <p>{@html item.text}</p>
        </article>
      {:else}
        <p class="notice">Todavía no hay registros públicos aprobados.</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="memory-title">
    <p class="eyebrow">Memoria oral y escrita</p>
    <h2 id="memory-title">Lo que las personas han querido conservar.</h2>
    <div class="memory-grid">
      {#each data.memories as memory}
        <article class="memory-panel">
          <p class="meta">{memory.category?.name ?? 'Memoria'}</p>
          <h3>{memory.title}</h3>
          <p>{@html memory.body}</p>
        </article>
      {:else}
        <p class="notice">Los testimonios aprobados aparecerán en esta sección.</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="visual-title">
    <p class="eyebrow">Material visible</p>
    <h2 id="visual-title">Fragmentos del archivo.</h2>
    <div class="story-grid">
      {#each data.media.slice(0, 9) as file}
        <article class="document-panel">
          {#if file.kind === 'IMAGE'}
            <img src={file.publicUrl} alt={file.altText ?? file.title} loading="lazy" />
          {:else if file.kind === 'VIDEO'}
            <video src={file.publicUrl} controls preload="metadata"><track kind="captions" /></video>
          {:else if file.kind === 'AUDIO'}
            <audio src={file.publicUrl} controls></audio>
          {:else}
            <a class="button secondary" href={file.publicUrl} target="_blank" rel="noreferrer">Abrir documento</a>
          {/if}
          <h3>{file.title}</h3>
          <p class="meta">{new Date(file.createdAt).toLocaleDateString('es-MX')}</p>
        </article>
      {:else}
        <p class="notice">Aún no hay material multimedia publicado.</p>
      {/each}
    </div>
  </section>

  <details class="quiet-search">
    <summary>Buscar con más precisión</summary>
    <form class="filters" method="GET">
      <label>Palabras clave
        <input name="q" value={data.filters.q ?? ''} />
      </label>
      <label>Enfoque
        <select name="type">
          <option value="">Todo</option>
          <option value="EVIDENCE" selected={data.filters.type === 'EVIDENCE'}>Documentación</option>
          <option value="MEMORY" selected={data.filters.type === 'MEMORY'}>Memoria</option>
        </select>
      </label>
      <label>Tema
        <select name="category">
          <option value="">Todos</option>
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
  </details>
</main>
