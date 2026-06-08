<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.surveys.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('admin.surveys.question')} <input name="question" required /></label>
    <label>{$t('admin.surveys.options')} <textarea name="options" required></textarea></label>
    <label><span><input type="checkbox" name="resultsPublic" checked /> {$t('admin.surveys.resultsVisible')}</span></label>
    <label><span><input type="checkbox" name="active" checked /> {$t('admin.surveys.active')}</span></label>
    <button type="submit">{$t('admin.surveys.create')}</button>
  </form>
  <div class="grid">
    {#each data.surveys as survey}
      <article class="card">
        <h2><a href={`/surveys/${survey.slug}`}>{survey.title}</a></h2>
        <p>{survey.question}</p>
        <p class="meta">{$t('admin.forms.responseCount', { count: survey._count.responses })}</p>
        <ul>{#each survey.options as option}<li>{option.label}: {option._count.responses}</li>{/each}</ul>
        <form method="POST" action="?/toggle">
          <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={survey.id} />
          <label><span><input type="checkbox" name="active" checked={survey.active} /> {$t('admin.surveys.active')}</span></label>
          <label><span><input type="checkbox" name="resultsPublic" checked={survey.resultsPublic} /> {$t('admin.surveys.resultsVisible')}</span></label>
          <button type="submit">{$t('admin.settings.save')}</button>
        </form>
      </article>
    {/each}
  </div>
</section>

