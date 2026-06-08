<script lang="ts">
  let { data, form } = $props();
  const fieldTypes = ['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'ATTACHMENT'];
</script>

<section class="section">
  <h1>Formularios ciudadanos</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Título <input name="title" required /></label>
    <label>Descripción <textarea name="description" required></textarea></label>
    <label><span><input type="checkbox" name="active" checked /> Activo</span></label>
    {#each [0, 1, 2, 3, 4, 5] as index}
      <div class="two-col">
        <label>Campo {index + 1} <input name="fieldLabel" /></label>
        <label>Tipo <select name="fieldType">{#each fieldTypes as type}<option value={type}>{type}</option>{/each}</select></label>
        <label>Opciones separadas por coma <input name="options" /></label>
        <label><span><input type="checkbox" name="required" value={String(index)} /> Requerido</span></label>
      </div>
    {/each}
    <button type="submit">Crear formulario</button>
  </form>
  <div class="grid">
    {#each data.forms as item}
      <article class="card">
        <h2><a href={`/forms/${item.slug}`}>{item.title}</a></h2>
        <p>{item.description}</p>
        <p class="meta">{item.fields.length} campos · {item._count.responses} respuestas</p>
        <form method="POST" action="?/toggle">
          <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="id" value={item.id} />
          <label><span><input type="checkbox" name="active" checked={item.active} /> Activo</span></label>
          <button type="submit">Guardar estado</button>
        </form>
      </article>
    {/each}
  </div>
  <h2>Respuestas recientes</h2>
  <div class="table-wrap"><table><thead><tr><th>Formulario</th><th>Respuesta</th><th>Fecha</th></tr></thead><tbody>{#each data.responses as response}<tr><td>{response.form.title}</td><td><pre>{JSON.stringify(response.values, null, 2)}</pre></td><td>{new Date(response.createdAt).toLocaleString('es-MX')}</td></tr>{/each}</tbody></table></div>
</section>
