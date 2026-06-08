<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
  const fieldTypes = ['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'ATTACHMENT'];
</script>

<section class="section">
  <h1>{$t('admin.forms.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('admin.collections.description')} <textarea name="description" required></textarea></label>
    <label><span><input type="checkbox" name="active" checked /> {$t('admin.forms.active')}</span></label>
    {#each [0, 1, 2, 3, 4, 5] as index}
      <div class="two-col">
        <label>{$t('admin.forms.fieldNumber', { number: index + 1 })} <input name="fieldLabel" /></label>
        <label>{$t('admin.forms.type')} <select name="fieldType">{#each fieldTypes as type}<option value={type}>{$t(`admin.forms.types.${type}`)}</option>{/each}</select></label>
        <label>{$t('admin.forms.options')} <input name="options" /></label>
        <label><span><input type="checkbox" name="required" value={String(index)} /> {$t('admin.forms.required')}</span></label>
      </div>
    {/each}
    <button type="submit">{$t('admin.forms.create')}</button>
  </form>
  <div class="grid">
    {#each data.forms as item}
      <article class="card">
        <h2><a href={`/forms/${item.slug}`}>{item.title}</a></h2>
        <p>{item.description}</p>
        <p class="meta">{$t('admin.forms.fieldsCount', { count: item.fields.length })} · {$t('admin.forms.responseCount', { count: item._count.responses })}</p>
        <form method="POST" action="?/toggle">
          <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={item.id} />
          <label><span><input type="checkbox" name="active" checked={item.active} /> {$t('admin.forms.active')}</span></label>
          <button type="submit">{$t('admin.forms.saveState')}</button>
        </form>
      </article>
    {/each}
  </div>
  <h2>{$t('admin.forms.recentResponses')}</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>{$t('admin.forms.formColumn')}</th>
          <th>{$t('admin.forms.responseColumn')}</th>
          <th>{$t('admin.content.table.date')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.responses as response}
          <tr>
            <td>{response.form.title}</td>
            <td><pre>{JSON.stringify(response.values, null, 2)}</pre></td>
            <td>{new Date(response.createdAt).toLocaleString('es-MX')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

