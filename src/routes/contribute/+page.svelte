<script lang="ts">
  import { t } from '$lib/i18n';
  import { compressImage } from '$lib/client/compress';

  let { data, form } = $props();
  let compressing = $state(false);

  async function handleFormSubmit(event: SubmitEvent) {
    const formEl = event.currentTarget as HTMLFormElement;
    if (formEl.dataset.compressed === 'true') return;

    event.preventDefault();
    compressing = true;

    try {
      const fileInputs = formEl.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      for (const input of fileInputs) {
        if (input.files && input.files.length > 0) {
          const dt = new DataTransfer();
          for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            const compressed = await compressImage(file);
            dt.items.add(compressed);
          }
          input.files = dt.files;
        }
      }
      formEl.dataset.compressed = 'true';
      formEl.requestSubmit();
    } catch (e) {
      console.error(e);
    } finally {
      compressing = false;
    }
  }
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
  {#if compressing}<p class="notice">{$t('admin.myContent.save')}...</p>{/if}
  <form class="form-stack document-panel" method="POST" enctype="multipart/form-data" onsubmit={handleFormSubmit}>
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

