<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.settings.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/home">
    <input type="hidden" name="csrf" value={data.csrf} />
    <h2>{$t('admin.settings.cover')}</h2>
    <label>{$t('admin.settings.causeName')} <input name="causeName" value={data.home.causeName} required /></label>
    <label>{$t('admin.settings.heroImageUrl')} <input name="heroImageUrl" value={data.home.heroImageUrl} required /></label>
    <label>{$t('admin.settings.heroImageAlt')} <input name="heroImageAlt" value={data.home.heroImageAlt} required /></label>
    <label>{$t('admin.settings.problemSummary')} <textarea name="problemSummary" required>{data.home.problemSummary}</textarea></label>
    <label>{$t('admin.settings.callToAction')} <textarea name="callToAction" required>{data.home.callToAction}</textarea></label>
    <button type="submit">{$t('admin.settings.saveCover')}</button>
  </form>
  <h2>{$t('admin.settings.menu')}</h2>
  <div class="grid">
    {#each [...data.menu, { id: '', label: '', href: '', position: data.menu.length + 1, visible: true }] as item}
      <form class="card form-stack" method="POST" action="?/menu">
        <input type="hidden" name="csrf" value={data.csrf} />
        <input type="hidden" name="id" value={item.id} />
        <label>{$t('admin.settings.label')} <input name="label" value={item.label} required /></label>
        <label>{$t('admin.settings.url')} <input name="href" value={item.href} required /></label>
        <label>{$t('admin.settings.order')} <input type="number" name="position" value={item.position} /></label>
        <label><span><input type="checkbox" name="visible" checked={item.visible} /> {$t('admin.settings.visible')}</span></label>
        <button type="submit">{$t('admin.settings.save')}</button>
      </form>
    {/each}
  </div>
</section>

