<script lang="ts">
  import { t } from '$lib/i18n';
  let { data } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="home-title">
    <div>
      <p class="eyebrow">{$t('hero.eyebrow')}</p>
      <h1 id="home-title">{$t('hero.title')}</h1>
      <p class="lead">{$t('cms.problemSummary')}</p>
      <div class="hero-actions">
        <a class="button" href="#ayudar">{$t('hero.howToHelp')}</a>
        <a class="button secondary" href="/archive">{$t('hero.viewDocumented')}</a>
      </div>
    </div>
    <div>
      <img class="hero-mark" src={data.home.heroImageUrl} alt={$t('cms.heroImageAlt')} loading="eager" />
      <div class="first-read" aria-label={$t('hero.essentialSummary')}>
        <p class="field-note"><strong>{$t('hero.whatIs')}</strong><br />{$t('hero.whatIsDesc')}</p>
        <p class="field-note"><strong>{$t('hero.whatHappens')}</strong><br />{$t('hero.whatHappensDesc')}</p>
        <p class="field-note"><strong>{$t('hero.whatToDo')}</strong><br />{$t('hero.whatToDoDesc')}</p>
      </div>
    </div>
  </section>

  <section class="section" id="que-pasa" aria-labelledby="what-title">
    <p class="eyebrow">{$t('home.whatIsHappening')}</p>
    <h2 id="what-title">{$t('home.understandFirst')}</h2>
    <p class="section-intro">{$t('home.intro')}</p>
    <div class="story-grid">
      <article class="story-panel urgent">
        <p class="meta">{$t('home.status')}</p>
        <h3>{$t('home.documentBeforeLost')}</h3>
        <p>{$t('home.statusDesc')}</p>
      </article>
      <article class="story-panel">
        <p class="meta">{$t('home.liveArchive')}</p>
        <h3>{$t('home.publishedRecords', { count: data.counts.documented })}</h3>
        <p>{$t('home.archiveDesc')}</p>
      </article>
      <article class="story-panel">
        <p class="meta">{$t('home.shelteredMaterial')}</p>
        <h3>{$t('home.mediaFilesCount', { count: data.counts.media })}</h3>
        <p>{$t('home.mediaDesc')}</p>
      </article>
    </div>
  </section>

  <section class="section" id="por-que-importa" aria-labelledby="why-title">
    <p class="eyebrow">{$t('home.whyItMatters')}</p>
    <h2 id="why-title">{$t('home.mountainIsMemory')}</h2>
    <div class="memory-grid">
      {#each data.reflections as reflection}
        <article class="memory-panel">
          <h3>{reflection.title}</h3>
          <p>{@html reflection.body}</p>
        </article>
      {:else}
        <article class="memory-panel">
          <h3>{$t('home.defaultReflection1Title')}</h3>
          <p>{$t('home.defaultReflection1Body')}</p>
        </article>
        <article class="memory-panel">
          <h3>{$t('home.defaultReflection2Title')}</h3>
          <p>{$t('home.defaultReflection2Body')}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="section" id="documentado" aria-labelledby="doc-title">
    <p class="eyebrow">{$t('home.whatHasBeenDocumented')}</p>
    <h2 id="doc-title">{$t('home.recentPieces')}</h2>
    <div class="story-grid">
      {#each data.latest as item}
        <article class="document-panel">
          <p class="meta">{item.category?.name ?? $t('home.publicRecord')}</p>
          <h3>{item.title}</h3>
          <p>{@html item.body}</p>
        </article>
      {:else}
        <p class="notice">{$t('home.noPublicRecords')}</p>
      {/each}
    </div>
    <p><a class="button secondary" href="/archive">{$t('home.viewNarrativeArchive')}</a></p>
  </section>

  <section class="section" id="memoria" aria-labelledby="memory-title">
    <p class="eyebrow">{$t('home.whatPeopleRemember')}</p>
    <h2 id="memory-title">{$t('home.firstPersonDefense')}</h2>
    <div class="memory-grid">
      {#each data.memories as memory}
        <article class="memory-panel">
          <h3>{memory.title}</h3>
          <p>{@html memory.body}</p>
        </article>
      {:else}
        <p class="notice">{$t('home.noMemoriesApproved')}</p>
      {/each}
    </div>
  </section>

  <section class="section" aria-labelledby="collections-title">
    <p class="eyebrow">{$t('home.suggestedPaths')}</p>
    <h2 id="collections-title">{$t('home.readStoriesNotTables')}</h2>
    <div class="story-grid">
      {#each data.collections as collection}
        <a class="document-panel" href={`/collections/${collection.slug}`}>
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </a>
      {:else}
        <p class="notice">{$t('home.noSuggestedPaths')}</p>
      {/each}
    </div>
  </section>

  <section class="section" id="ayudar" aria-labelledby="help-title">
    <p class="eyebrow">{$t('home.howCanIHelp')}</p>
    <h2 id="help-title">{$t('home.participateNoLoss')}</h2>
    <div class="story-grid">
      {#each data.forms as form}
        <a class="story-panel urgent" href={`/forms/${form.slug}`}>
          <p class="meta">{$t('home.openAction')}</p>
          <h3>{form.title}</h3>
          <p>{form.description}</p>
        </a>
      {:else}
        <article class="story-panel urgent">
          <p class="meta">{$t('home.participation')}</p>
          <h3>{$t('home.sharePortal')}</h3>
          <p>{$t('home.sharePortalDesc')}</p>
        </article>
      {/each}
      {#each data.surveys as survey}
        <a class="story-panel" href={`/surveys/${survey.slug}`}>
          <p class="meta">{$t('home.communityQuestion')}</p>
          <h3>{survey.title}</h3>
          <p>{survey.question}</p>
        </a>
      {/each}
    </div>
  </section>
</main>

