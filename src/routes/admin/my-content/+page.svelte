<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.myContent.title')}</h1>

  {#if form?.message}
    <p class="notice" class:error={form.message.startsWith('errors.') || form.message.startsWith('validation.')}>
      {$t(form.message)}
    </p>
  {/if}

  <div class="actions" style="margin-bottom: 2rem;">
    <a class="button" href="/contribute">{$t('admin.myContent.newContribution')}</a>
  </div>

  <div class="grid" style="margin-bottom: 2rem;">
    <!-- Form to create registered articles -->
    <form class="card form-stack" method="POST" action="?/article">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>{$t('admin.content.newArticle')}</h2>
      <label>
        {$t('contributions.fields.title')}
        <input name="title" required />
      </label>
      <label>
        {$t('admin.content.outlet')}
        <input name="outlet" required />
      </label>
      <label>
        {$t('admin.content.table.author')}
        <input name="authorName" />
      </label>
      <label>
        {$t('admin.content.table.date')}
        <input type="date" name="publishedOn" required />
      </label>
      <label>
        {$t('admin.content.url')}
        <input type="url" name="url" required />
      </label>
      <label>
        {$t('contributions.fields.category')}
        <select name="categoryId">
          <option value="">{$t('admin.content.noCategory')}</option>
          {#each data.categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </label>
      <label>
        {$t('admin.settings.problemSummary')}
        <textarea name="summary" required></textarea>
      </label>
      <button type="submit">{$t('admin.content.saveArticle')}</button>
    </form>

    <!-- Form to create reflections -->
    <form class="card form-stack" method="POST" action="?/reflection">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>{$t('admin.content.newReflection')}</h2>
      <label>
        {$t('contributions.fields.title')}
        <input name="title" required />
      </label>
      <label>
        {$t('contributions.fields.category')}
        <select name="categoryId">
          <option value="">{$t('admin.content.noCategory')}</option>
          {#each data.categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </label>
      <label>
        {$t('admin.content.text')}
        <textarea name="body" required></textarea>
      </label>
      <button type="submit">{$t('admin.content.publish')}</button>
    </form>
  </div>

  <h2>{$t('admin.myContent.contributionText')}</h2>
  <div class="table-wrap" style="margin-bottom: 2rem;">
    <table>
      <thead>
        <tr>
          <th>{$t('admin.content.table.title')}</th>
          <th>{$t('admin.content.table.status')}</th>
          <th>{$t('admin.content.table.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.contributions as item}
          <tr>
            <td>
              <strong>{item.title}</strong>
              <br />
              <span class="meta">
                {item.type === 'MEMORY' ? $t('contributions.typeMemory') : $t('contributions.typeEvidence')}
                · {item.category?.name ?? $t('admin.content.noCategory')}
              </span>
              {#if item.rejectionNote}
                <p class="meta error" style="margin: 0.5rem 0 0; padding: 0.5rem; border-left: 3px solid #8b2f25;">
                  <strong>{$t('admin.content.reject')}:</strong> {item.rejectionNote}
                </p>
              {/if}
            </td>
            <td>
              <span class="meta">{item.status}</span>
            </td>
            <td>
              {#if item.status === 'PENDING'}
                <a class="button secondary" href={`/admin/edit/contribution/${item.id}`}>{$t('admin.myContent.editButton')}</a>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="meta">{$t('admin.myContent.noContent')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>{$t('admin.myContent.articleText')}</h2>
  <div class="table-wrap" style="margin-bottom: 2rem;">
    <table>
      <thead>
        <tr>
          <th>{$t('admin.content.table.title')}</th>
          <th>{$t('admin.content.table.status')}</th>
          <th>{$t('admin.content.table.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.articles as item}
          <tr>
            <td>
              <strong>{item.title}</strong>
              <br />
              <span class="meta">{item.outlet} · {item.category?.name ?? $t('admin.content.noCategory')}</span>
            </td>
            <td>
              <span class="meta">{item.status}</span>
            </td>
            <td>
              {#if item.status === 'PENDING'}
                <a class="button secondary" href={`/admin/edit/article/${item.id}`}>{$t('admin.myContent.editButton')}</a>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="meta">{$t('admin.myContent.noContent')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>{$t('admin.myContent.reflectionText')}</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>{$t('admin.content.table.title')}</th>
          <th>{$t('admin.content.table.status')}</th>
          <th>{$t('admin.content.table.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.reflections as item}
          <tr>
            <td>
              <strong>{item.title}</strong>
              <br />
              <span class="meta">{item.category?.name ?? $t('admin.content.noCategory')}</span>
            </td>
            <td>
              <span class="meta">{item.status}</span>
            </td>
            <td>
              {#if item.status === 'PENDING'}
                <a class="button secondary" href={`/admin/edit/reflection/${item.id}`}>{$t('admin.myContent.editButton')}</a>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="meta">{$t('admin.myContent.noContent')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
