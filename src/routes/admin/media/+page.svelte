<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.sidebar.media')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" enctype="multipart/form-data" action="?/upload">
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
      <article class="card">
        <h2>{file.title}</h2>
        <p class="meta">{$t('admin.media.metaFormat', { kind: $t('admin.media.kinds.' + file.kind), mime: file.mimeType, size: Math.round(file.sizeBytes / 1024), author: file.author.name, date: new Date(file.createdAt).toLocaleDateString('es-MX') })}</p>
        {#if file.kind === 'IMAGE'}<img src={file.publicUrl} alt={file.altText ?? file.title} loading="lazy" />{/if}
        {#if file.kind === 'VIDEO'}<video src={file.publicUrl} controls preload="metadata"><track kind="captions" /></video>{/if}
        {#if file.kind === 'AUDIO'}<audio src={file.publicUrl} controls></audio>{/if}
        {#if file.kind === 'DOCUMENT'}<a href={file.publicUrl} target="_blank" rel="noreferrer">{$t('admin.media.viewDocument')}</a>{/if}
      </article>
    {/each}
  </div>
</section>

