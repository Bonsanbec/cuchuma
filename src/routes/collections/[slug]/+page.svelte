<script lang="ts">
  import { t } from '$lib/i18n';
  let { data } = $props();
</script>

<main>
  {#if data.collection}
    <section class="story-hero" aria-labelledby="collection-title">
      <div>
        <p class="eyebrow">{$t('collections.themePath')}</p>
        <h1 id="collection-title">{data.collection.title}</h1>
        <p class="lead">{data.collection.description}</p>
        <p><a class="button secondary" href="/archive">{$t('collections.backToArchive')}</a></p>
      </div>
      <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
    </section>
    <section class="section">
      <p class="eyebrow">{$t('collections.gatheredMaterial')}</p>
      <h2>{$t('collections.possibleReading')}</h2>
      <div class="timeline">
      {#each data.collection.items as item}
        <article>
          <p class="meta">{item.contribution.category?.name ?? $t('home.publicRecord')}</p>
          <h3>{item.contribution.title}</h3>
          <p>{@html item.contribution.body}</p>
        </article>
      {:else}
        <p class="notice">{$t('collections.empty')}</p>
      {/each}
      </div>
    </section>
  {:else}
    <h1>{$t('collections.unavailable')}</h1>
  {/if}
</main>

