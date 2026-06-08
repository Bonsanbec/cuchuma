<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Encuestas rápidas</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Título <input name="title" required /></label>
    <label>Pregunta <input name="question" required /></label>
    <label>Opciones <textarea name="options" required></textarea></label>
    <label><span><input type="checkbox" name="resultsPublic" checked /> Resultados visibles</span></label>
    <label><span><input type="checkbox" name="active" checked /> Activa</span></label>
    <button type="submit">Crear encuesta</button>
  </form>
  <div class="grid">
    {#each data.surveys as survey}
      <article class="card">
        <h2><a href={`/surveys/${survey.slug}`}>{survey.title}</a></h2>
        <p>{survey.question}</p>
        <p class="meta">{survey._count.responses} respuestas</p>
        <ul>{#each survey.options as option}<li>{option.label}: {option._count.responses}</li>{/each}</ul>
        <form method="POST" action="?/toggle">
          <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={survey.id} />
          <label><span><input type="checkbox" name="active" checked={survey.active} /> Activa</span></label>
          <label><span><input type="checkbox" name="resultsPublic" checked={survey.resultsPublic} /> Resultados visibles</span></label>
          <button type="submit">Guardar</button>
        </form>
      </article>
    {/each}
  </div>
</section>
