<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();

  let options = $state(['', '']);

  function addOption() {
    options.push('');
  }

  function removeOption(index: number) {
    if (options.length > 1) {
      options.splice(index, 1);
    }
  }
</script>

<section class="section">
  <h1>{$t('admin.surveys.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>{$t('contributions.fields.title')} <input name="title" required /></label>
    <label>{$t('admin.surveys.question')} <input name="question" required /></label>
    
    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
      <label style="margin-bottom: 0.25rem;">{$t('admin.surveys.options')}</label>
      {#each options as option, index}
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <input name="options" bind:value={options[index]} required placeholder={`${$t('admin.surveys.addOption')} ${index + 1}`} />
          {#if options.length > 2}
            <button type="button" class="danger" onclick={() => removeOption(index)} style="padding: 0.2rem 0.6rem; min-height: auto; font-size: 0.9rem; border-radius: 4px;">
              ×
            </button>
          {/if}
        </div>
      {/each}
      <button type="button" class="secondary" onclick={addOption} style="padding: 0.4rem 0.8rem; min-height: auto; align-self: start; margin-top: 0.25rem;">
        {$t('admin.surveys.addOption')}
      </button>
    </div>

    <label><span><input type="checkbox" name="resultsPublic" checked /> {$t('admin.surveys.resultsVisible')}</span></label>
    <label><span><input type="checkbox" name="active" checked /> {$t('admin.surveys.active')}</span></label>
    <button type="submit">{$t('admin.surveys.create')}</button>
  </form>
  <div class="grid">
    {#each data.surveys as survey}
      <article class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h2><a href={`/surveys/${survey.slug}`}>{survey.title}</a></h2>
          <p>{survey.question}</p>
          <p class="meta">{$t('admin.forms.responseCount', { count: survey._count.responses })}</p>
          <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
            {#each survey.options as option}
              <li>{option.label}: {option._count.responses}</li>
            {/each}
          </ul>
        </div>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <form method="POST" action="?/toggle" style="margin: 0;">
            <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={survey.id} />
            <label style="margin-bottom: 0.25rem;"><span><input type="checkbox" name="active" checked={survey.active} /> {$t('admin.surveys.active')}</span></label>
            <label style="margin-bottom: 0.5rem;"><span><input type="checkbox" name="resultsPublic" checked={survey.resultsPublic} /> {$t('admin.surveys.resultsVisible')}</span></label>
            <button type="submit" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">{$t('admin.settings.save')}</button>
          </form>
          <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('¿Estás seguro de que deseas eliminar esta encuesta? Esta acción es irreversible y se eliminarán todas las respuestas/votos ciudadanos asociados.')) e.preventDefault(); }} style="margin: 0;">
            <input type="hidden" name="csrf" value={data.csrf} />
            <input type="hidden" name="id" value={survey.id} />
            <button type="submit" class="danger" style="width: 100%; min-height: auto; padding: 0.4rem 0.8rem;">
              {$t('admin.content.delete')}
            </button>
          </form>
        </div>
      </article>
    {/each}
  </div>
</section>

