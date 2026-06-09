<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.content.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <div class="grid">
    <form class="card form-stack" method="POST" action="?/article">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>{$t('admin.content.newArticle')}</h2>
      <label>{$t('contributions.fields.title')} <input name="title" required /></label>
      <label>{$t('admin.content.outlet')} <input name="outlet" required /></label>
      <label>{$t('admin.content.table.author')} <input name="authorName" /></label>
      <label>{$t('admin.content.table.date')} <input type="date" name="publishedOn" required /></label>
      <label>{$t('admin.content.url')} <input type="url" name="url" required /></label>
      <label>{$t('contributions.fields.category')} <select name="categoryId"><option value="">{$t('admin.content.noCategory')}</option>{#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}</select></label>
      <label>{$t('admin.settings.problemSummary')} <textarea name="summary" required></textarea></label>
      <button type="submit">{$t('admin.content.saveArticle')}</button>
    </form>
    <form class="card form-stack" method="POST" action="?/reflection">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>{$t('admin.content.newReflection')}</h2>
      <label>{$t('contributions.fields.title')} <input name="title" required /></label>
      <label>{$t('contributions.fields.category')} <select name="categoryId"><option value="">{$t('admin.content.noCategory')}</option>{#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}</select></label>
      <label>{$t('admin.content.text')} <textarea name="body" required></textarea></label>
      <button type="submit">{$t('admin.content.publish')}</button>
    </form>
  </div>
  <div class="card" style="margin-top: 1.5rem;">
    <h2>{$t('admin.content.categories')}</h2>
    <form class="form-stack" method="POST" action="?/category" style="margin-bottom: 1.5rem;">
      <input type="hidden" name="csrf" value={data.csrf} />
      <div class="two-col">
        <label>{$t('admin.users.name')} <input name="name" required /></label>
        <label>{$t('admin.collections.description')} <input name="description" /></label>
      </div>
      <button type="submit">{$t('admin.content.saveCategory')}</button>
    </form>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{$t('admin.users.name')}</th>
            <th>{$t('admin.collections.description')}</th>
            <th>{$t('admin.content.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {#each data.categories as category}
            <tr>
              <td><strong>{category.name}</strong><br /><span class="meta">{category.slug}</span></td>
              <td>{category.description ?? ''}</td>
              <td>
                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Las publicaciones asociadas no se eliminarán, pero se quedarán sin categoría.')) e.preventDefault(); }} style="margin: 0;">
                  <input type="hidden" name="csrf" value={data.csrf} />
                  <input type="hidden" name="entity" value="category" />
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" class="danger" style="padding: 0.3rem 0.6rem; min-height: auto; font-size: 0.8rem;">
                    {$t('admin.content.delete')}
                  </button>
                </form>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="3" class="meta">{$t('admin.content.noCategories')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>{$t('admin.content.tableContent')}</th><th>{$t('admin.content.table.status')}</th><th>{$t('admin.content.table.actions')}</th></tr></thead>
      <tbody>
        {#each data.contributions as item}
          <tr>
            <td>{item.title}<br /><span class="meta">{$t('admin.content.contribution')} · {item.author.name} · {item.category?.name ?? $t('admin.content.noCategory')}</span></td>
            <td>{item.status}</td>
            <td>
              <div style="display: flex; gap: 0.5rem; align-items: start; margin-bottom: 0.5rem;">
                <a class="button secondary" href={`/admin/edit/contribution/${item.id}`} style="padding: 0.4rem 0.8rem; min-height: auto;">
                  {$t('admin.content.edit')}
                </a>
                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar esta aportación?')) e.preventDefault(); }} style="margin: 0; display: inline-block;">
                  <input type="hidden" name="csrf" value={data.csrf} />
                  <input type="hidden" name="entity" value="contribution" />
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" class="danger" style="padding: 0.4rem 0.8rem; min-height: auto;">
                    {$t('admin.content.delete')}
                  </button>
                </form>
              </div>
              <form method="POST" action="?/moderate" class="form-stack">
                <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="contribution" /><input type="hidden" name="id" value={item.id} />
                <textarea name="rejectionNote" placeholder={$t('admin.content.rejectionReason')}></textarea>
                <div style="display: flex; gap: 0.5rem;">
                  <button name="status" value="APPROVED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.approve')}</button>
                  <button class="danger" name="status" value="REJECTED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.reject')}</button>
                </div>
              </form>
            </td>
          </tr>
        {/each}
        {#each data.articles as item}
          <tr>
            <td>{item.title}<br /><span class="meta">{$t('admin.content.article')} · {item.outlet}</span></td>
            <td>{item.status}</td>
            <td>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <a class="button secondary" href={`/admin/edit/article/${item.id}`} style="padding: 0.4rem 0.8rem; min-height: auto;">
                  {$t('admin.content.edit')}
                </a>
                <form method="POST" action="?/moderate" style="margin: 0; display: inline-flex; gap: 0.5rem;">
                  <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="article" /><input type="hidden" name="id" value={item.id} />
                  <button name="status" value="APPROVED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.approve')}</button>
                  <button class="danger" name="status" value="REJECTED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.reject')}</button>
                </form>
                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar esta nota periodística?')) e.preventDefault(); }} style="margin: 0; display: inline-block;">
                  <input type="hidden" name="csrf" value={data.csrf} />
                  <input type="hidden" name="entity" value="article" />
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" class="danger" style="padding: 0.4rem 0.8rem; min-height: auto;">
                    {$t('admin.content.delete')}
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
        {#each data.reflections as item}
          <tr>
            <td>{item.title}<br /><span class="meta">{$t('admin.content.reflection')}</span></td>
            <td>{item.status}</td>
            <td>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <a class="button secondary" href={`/admin/edit/reflection/${item.id}`} style="padding: 0.4rem 0.8rem; min-height: auto;">
                  {$t('admin.content.edit')}
                </a>
                <form method="POST" action="?/moderate" style="margin: 0; display: inline-flex; gap: 0.5rem;">
                  <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="reflection" /><input type="hidden" name="id" value={item.id} />
                  <button name="status" value="APPROVED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.approve')}</button>
                  <button class="danger" name="status" value="REJECTED" style="padding: 0.4rem 0.8rem; min-height: auto;">{$t('admin.content.reject')}</button>
                </form>
                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar esta reflexión?')) e.preventDefault(); }} style="margin: 0; display: inline-block;">
                  <input type="hidden" name="csrf" value={data.csrf} />
                  <input type="hidden" name="entity" value="reflection" />
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" class="danger" style="padding: 0.4rem 0.8rem; min-height: auto;">
                    {$t('admin.content.delete')}
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

