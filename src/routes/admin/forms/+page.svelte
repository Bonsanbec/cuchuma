<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
  const fieldTypes = ['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'ATTACHMENT'];

  let fields = $state([
    { label: '', type: 'SHORT_TEXT', options: '', required: false }
  ]);

  function addField() {
    fields.push({ label: '', type: 'SHORT_TEXT', options: '', required: false });
  }

  function removeField(index: number) {
    if (fields.length > 1) {
      fields.splice(index, 1);
    }
  }
</script>

<section class="section">
  <h1>{$t('admin.forms.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('admin.collections.description')} <textarea name="description" required></textarea></label>
    <label><span><input type="checkbox" name="active" checked /> {$t('admin.forms.active')}</span></label>
    
    {#each fields as field, index}
      <div class="card" style="margin-bottom: 1rem; border: 1px dashed var(--line); position: relative; padding: 1.5rem 1rem 1rem 1rem;">
        {#if fields.length > 1}
          <button type="button" class="danger" onclick={() => removeField(index)} style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.2rem 0.5rem; min-height: auto; font-size: 0.8rem; border-radius: 4px;">
            ×
          </button>
        {/if}
        <div class="two-col">
          <label>{$t('admin.forms.fieldNumber', { number: index + 1 })} <input name="fieldLabel" bind:value={field.label} required /></label>
          <label>{$t('admin.forms.type')} 
            <select name="fieldType" bind:value={field.type}>
              {#each fieldTypes as type}
                <option value={type}>{$t(`admin.forms.types.${type}`)}</option>
              {/each}
            </select>
          </label>
          <label>{$t('admin.forms.options')} <input name="options" bind:value={field.options} placeholder={$t('admin.forms.optionsPlaceholder')} /></label>
          <label><span><input type="checkbox" name="required" value={String(index)} bind:checked={field.required} /> {$t('admin.forms.required')}</span></label>
        </div>
      </div>
    {/each}

    <button type="button" class="secondary" onclick={addField} style="margin-bottom: 1rem; align-self: start;">
      {$t('admin.forms.addField')}
    </button>
    
    <button type="submit">{$t('admin.forms.create')}</button>
  </form>
  <div class="grid">
    {#each data.forms as item}
      <article class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h2><a href={`/forms/${item.slug}`}>{item.title}</a></h2>
          <p>{item.description}</p>
          <p class="meta">{$t('admin.forms.fieldsCount', { count: item.fields.length })} · {$t('admin.forms.responseCount', { count: item._count.responses })}</p>
        </div>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <form method="POST" action="?/toggle" style="margin: 0;">
            <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={item.id} />
            <label style="margin-bottom: 0.5rem;"><span><input type="checkbox" name="active" checked={item.active} /> {$t('admin.forms.active')}</span></label>
            <button type="submit" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">{$t('admin.forms.saveState')}</button>
          </form>
          <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar este formulario? Esta acción es irreversible y se eliminarán todas las respuestas ciudadanas asociadas.')) e.preventDefault(); }} style="margin: 0;">
            <input type="hidden" name="csrf" value={data.csrf} />
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" class="danger" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">
              {$t('admin.content.delete')}
            </button>
          </form>
        </div>
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

