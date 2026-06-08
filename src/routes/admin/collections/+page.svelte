<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.collections.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('admin.collections.description')} <textarea name="description" required></textarea></label>
    <label><span><input type="checkbox" name="published" checked /> {$t('admin.collections.published')}</span></label>
    <fieldset>
      <legend>{$t('admin.collections.approvedContributions')}</legend>
      {#each data.contributions as contribution}
        <label><span><input type="checkbox" name="contributionId" value={contribution.id} /> {contribution.title}</span></label>
      {/each}
    </fieldset>
    <button type="submit">{$t('admin.collections.create')}</button>
  </form>
  <div class="grid">
    {#each data.collections as collection}
      <article class="card">
        <h2><a href={`/collections/${collection.slug}`}>{collection.title}</a></h2>
        <p>{collection.description}</p>
        <p class="meta">{collection.published ? $t('admin.collections.published') : $t('admin.collections.private')} · {$t('admin.collections.itemsCount', { count: collection.items.length })}</p>
      </article>
    {/each}
  </div>
</section>

