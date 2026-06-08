<script lang="ts">
  import { t } from '$lib/i18n';
  let { data } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="archive-title">
    <div>
      <p class="eyebrow">{$t('archive.eyebrow')}</p>
      <h1 id="archive-title">{$t('archive.title')}</h1>
      <p class="lead">{$t('archive.lead')}</p>
      <div class="hero-actions">
        <a class="button" href="#linea-tiempo">{$t('archive.viewTimeline')}</a>
        <a class="button secondary" href="#recorridos">{$t('archive.explorePaths')}</a>
      </div>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
  </section>

  <section class="section" id="recorridos" aria-labelledby="routes-title">
    <p class="eyebrow">{$t('archive.pathsToStart')}</p>
    <h2 id="routes-title">{$t('archive.enterByStories')}</h2>
    <div class="story-grid">
      {#each data.collections as collection}
        <a class="story-panel" href={`/collections/${collection.slug}`}>
          <p class="meta">{$t('archive.relatedRecords', { count: collection.items.length })}</p>
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </a>
      {:else}
        <article class="story-panel">
          <p class="meta">{$t('archive.organizingArchive')}</p>
          <h3>{$t('archive.organizingArchiveTitle')}</h3>
          <p>{$t('archive.organizingArchiveDesc')}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="section" id="linea-tiempo" aria-labelledby="timeline-title">
    <p class="eyebrow">{$t('archive.currentHappening')}</p>
    <h2 id="timeline-title">{$t('archive.publicTimeline')}</h2>
    <div class="timeline">
      {#each data.timeline as item}
        <article>
          <p class="meta">{new Date(item.date).toLocaleDateString('es-MX')} · {item.kind}{item.category ? ` · ${item.category}` : ''}</p>
          <h3>{#if item.url}<a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>{:else}{item.title}{/if}</h3>
          <p>{@html item.text}</p>
        </article>
      {:else}
        <p class="notice">{$t('archive.noPublicApproved')}</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="memory-title">
    <p class="eyebrow">{$t('archive.oralAndWrittenMemory')}</p>
    <h2 id="memory-title">{$t('archive.whatPeopleSaved')}</h2>
    <div class="memory-grid">
      {#each data.memories as memory}
        <article class="memory-panel">
          <p class="meta">{memory.category?.name ?? $t('archive.memoryCategory')}</p>
          <h3>{memory.title}</h3>
          <p>{@html memory.body}</p>
        </article>
      {:else}
        <p class="notice">{$t('archive.noTestimonies')}</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="visual-title">
    <p class="eyebrow">{$t('archive.visibleMaterial')}</p>
    <h2 id="visual-title">{$t('archive.archiveFragments')}</h2>
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
            <a class="button secondary" href={file.publicUrl} target="_blank" rel="noreferrer">{$t('archive.openDocument')}</a>
          {/if}
          <h3>{file.title}</h3>
          <p class="meta">{new Date(file.createdAt).toLocaleDateString('es-MX')}</p>
        </article>
      {:else}
        <p class="notice">{$t('archive.noMedia')}</p>
      {/each}
    </div>
  </section>

  <details class="quiet-search">
    <summary>{$t('archive.preciseSearch')}</summary>
    <form class="filters" method="GET">
      <label>{$t('archive.keywords')}
        <input name="q" value={data.filters.q ?? ''} />
      </label>
      <label>{$t('archive.focus')}
        <select name="type">
          <option value="">{$t('archive.all')}</option>
          <option value="EVIDENCE" selected={data.filters.type === 'EVIDENCE'}>{$t('archive.documentation')}</option>
          <option value="MEMORY" selected={data.filters.type === 'MEMORY'}>{$t('archive.memoryCategory')}</option>
        </select>
      </label>
      <label>{$t('archive.theme')}
        <select name="category">
          <option value="">{$t('archive.allThemes')}</option>
          {#each data.categories as category}
            <option value={category.id} selected={data.filters.category === category.id}>{category.name}</option>
          {/each}
        </select>
      </label>
      <label>{$t('archive.since')}
        <input type="date" name="from" value={data.filters.from ?? ''} />
      </label>
      <button type="submit">{$t('archive.searchButton')}</button>
    </form>
  </details>
</main>

