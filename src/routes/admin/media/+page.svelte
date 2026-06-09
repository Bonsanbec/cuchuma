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
      const fileInput = formEl.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const dt = new DataTransfer();
        const file = fileInput.files[0];
        const compressed = await compressImage(file);
        dt.items.add(compressed);
        fileInput.files = dt.files;
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

<section class="section">
  <h1>{$t('admin.sidebar.media')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  {#if compressing}<p class="notice">{$t('admin.myContent.save')}...</p>{/if}
  <form class="card form-stack" method="POST" enctype="multipart/form-data" action="?/upload" onsubmit={handleFormSubmit}>
    <input type="hidden" name="csrf" value={data.csrf} />
    <div class="two-col">
      <label>{$t('contributions.fields.title')} <input name="title" /></label>
      <label>{$t('admin.settings.heroImageAlt')} <input name="altText" /></label>
    </div>
    <label>{$t('admin.collections.description')} <textarea name="description"></textarea></label>
    <label>{$t('contributions.fields.files')} <input type="file" name="file" accept="image/*,video/*,audio/*,application/pdf,text/plain" required /></label>
    <button type="submit">{$t('admin.media.upload')}</button>
  </form>
  <div class="grid">
    {#each data.media as file}
      <article class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h2>{file.title}</h2>
          <p class="meta">{$t('admin.media.metaFormat', { kind: $t('admin.media.kinds.' + file.kind), mime: file.mimeType, size: Math.round(file.sizeBytes / 1024), author: file.author.name, date: new Date(file.createdAt).toLocaleDateString('es-MX') })}</p>
          <div style="margin: 0.75rem 0;">
            {#if file.kind === 'IMAGE'}<img src={file.publicUrl} alt={file.altText ?? file.title} loading="lazy" style="max-height: 200px; object-fit: contain; width: 100%; border-radius: 4px;" />{/if}
            {#if file.kind === 'VIDEO'}<video src={file.publicUrl} controls preload="metadata" style="max-height: 200px; width: 100%;"><track kind="captions" /></video>{/if}
            {#if file.kind === 'AUDIO'}<audio src={file.publicUrl} controls style="width: 100%;"></audio>{/if}
            {#if file.kind === 'DOCUMENT'}<a href={file.publicUrl} target="_blank" rel="noreferrer" class="button secondary" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">{$t('admin.media.viewDocument')}</a>{/if}
          </div>
        </div>
        {#if file.authorId === data.user?.id || data.user?.role?.level === 'ADMIN' || data.user?.role?.level === 'MEMBER'}
          <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm($t('admin.media.confirmDelete'))) e.preventDefault(); }} style="margin: 0; margin-top: 0.5rem;">
            <input type="hidden" name="csrf" value={data.csrf} />
            <input type="hidden" name="id" value={file.id} />
            <button type="submit" class="danger" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">
              {$t('admin.media.delete')}
            </button>
          </form>
        {/if}
      </article>
    {/each}
  </div>
</section>

