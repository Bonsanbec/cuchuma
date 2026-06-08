<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="contribute-title">
    <div>
      <p class="eyebrow">{$t('contributions.eyebrow')}</p>
      <h1 id="contribute-title">{$t('contributions.title')}</h1>
      <p class="lead">{$t('contributions.lead')}</p>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt={$t('cms.heroImageAlt')} />
  </section>
  {#if form?.message}<p class="notice">{form.message.startsWith('contributions.') || form.message.startsWith('errors.') ? $t(form.message) : form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('contributions.selectType')}
      <select name="type" required>
        <option value="MEMORY">{$t('contributions.typeMemory')}</option>
        <option value="EVIDENCE">{$t('contributions.typeEvidence')}</option>
      </select>
    </label>
    <label>{$t('contributions.fields.category')}
      <select name="categoryId">
        <option value="">{$t('contributions.fields.notSure')}</option>
        {#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}
      </select>
    </label>
    <label>{$t('contributions.fields.body')} <textarea name="body" required></textarea></label>
    <label>{$t('contributions.fields.links')} <textarea name="externalLinks"></textarea></label>
    <label>{$t('contributions.fields.files')} <input type="file" name="files" multiple accept="image/*,video/*,audio/*,application/pdf,text/plain" /></label>
    <button type="submit">{$t('contributions.submit')}</button>
  </form>
</main>

