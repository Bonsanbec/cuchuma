<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
  let total = $derived(data.survey?._count.responses ?? 0);
</script>

<main>
  {#if data.survey}
    <section class="story-hero" aria-labelledby="survey-title">
      <div>
        <p class="eyebrow">{$t('home.communityQuestion')}</p>
        <h1 id="survey-title">{data.survey.title}</h1>
        <p class="lead">{data.survey.question}</p>
      </div>
      <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
    </section>
    {#if form?.message}<p class="notice">{form.message.startsWith('surveys.') || form.message.startsWith('errors.') ? $t(form.message) : form.message}</p>{/if}
    <form class="form-stack document-panel" method="POST">
      <input type="hidden" name="csrf" value={data.csrf} />
      {#each data.survey.options as option}
        <label>
          <span><input type="radio" name="optionId" value={option.id} required /> {option.label}</span>
          {#if data.survey.resultsPublic}
            <span class="meta">{total ? Math.round((option._count.responses / total) * 100) : 0}% · {$t('surveys.totalVotes', { count: option._count.responses })}</span>
          {/if}
        </label>
      {/each}
      <button type="submit">{$t('surveys.voteButton')}</button>
    </form>
  {:else}
    <h1>{$t('surveys.unavailable')}</h1>
  {/if}
</main>

