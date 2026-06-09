<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();

  const formattedDate = $derived(
    data.item.publishedOn
      ? new Date(data.item.publishedOn).toISOString().split('T')[0]
      : ''
  );
</script>

<section class="section">
  <h1>{$t('admin.myContent.editTitle')}</h1>

  {#if form?.message}
    <p class="notice" class:error={form.message.startsWith('errors.') || form.message.startsWith('validation.')}>
      {$t(form.message)}
    </p>
  {/if}

  <form class="form-stack card" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value={data.csrf} />

    {#if data.type === 'contribution'}
      <label>
        {$t('contributions.fields.title')}
        <input name="title" value={data.item.title} required />
      </label>
      <label>
        {$t('contributions.selectType')}
        <select name="type" required>
          <option value="MEMORY" selected={data.item.type === 'MEMORY'}>{$t('contributions.typeMemory')}</option>
          <option value="EVIDENCE" selected={data.item.type === 'EVIDENCE'}>{$t('contributions.typeEvidence')}</option>
        </select>
      </label>
      <label>
        {$t('contributions.fields.category')}
        <select name="categoryId">
          <option value="">{$t('contributions.fields.notSure')}</option>
          {#each data.categories as category}
            <option value={category.id} selected={data.item.categoryId === category.id}>{category.name}</option>
          {/each}
        </select>
      </label>
      <label>
        {$t('contributions.fields.body')}
        <textarea name="body" required>{data.item.body}</textarea>
      </label>
      <label>
        {$t('contributions.fields.links')}
        <textarea name="externalLinks">{data.item.externalLinks?.join('\n') ?? ''}</textarea>
      </label>
      <label>
        {$t('contributions.fields.files')}
        <input type="file" name="files" multiple accept="image/*,video/*,audio/*,application/pdf,text/plain" />
      </label>

    {:else}
      {#if data.type === 'article'}
        <label>
          {$t('contributions.fields.title')}
          <input name="title" value={data.item.title} required />
        </label>
        <label>
          {$t('admin.content.outlet')}
          <input name="outlet" value={data.item.outlet} required />
        </label>
        <label>
          {$t('admin.content.table.author')}
          <input name="authorName" value={data.item.authorName ?? ''} />
        </label>
        <label>
          {$t('admin.content.table.date')}
          <input type="date" name="publishedOn" value={formattedDate} required />
        </label>
        <label>
          {$t('admin.content.url')}
          <input type="url" name="url" value={data.item.url} required />
        </label>
        <label>
          {$t('contributions.fields.category')}
          <select name="categoryId">
            <option value="">{$t('admin.content.noCategory')}</option>
            {#each data.categories as category}
              <option value={category.id} selected={data.item.categoryId === category.id}>{category.name}</option>
            {/each}
          </select>
        </label>
        <label>
          {$t('admin.settings.problemSummary')}
          <textarea name="summary" required>{data.item.summary}</textarea>
        </label>
      {:else}
        <!-- reflection -->
        <label>
          {$t('contributions.fields.title')}
          <input name="title" value={data.item.title} required />
        </label>
        <label>
          {$t('contributions.fields.category')}
          <select name="categoryId">
            <option value="">{$t('admin.content.noCategory')}</option>
            {#each data.categories as category}
              <option value={category.id} selected={data.item.categoryId === category.id}>{category.name}</option>
            {/each}
          </select>
        </label>
        <label>
          {$t('admin.content.text')}
          <textarea name="body" required>{data.item.body}</textarea>
        </label>
      {/if}
    {/if}

    <div class="actions">
      <button type="submit">{$t('admin.myContent.save')}</button>
      <a class="button secondary" href={data.pathname.includes('/admin/content') ? '/admin/content' : '/admin/my-content'}>
        {$t('collections.backToArchive')}
      </a>
    </div>
  </form>
</section>
