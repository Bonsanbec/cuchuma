<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Configuración del sitio</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="card form-stack" method="POST" action="?/home">
    <input type="hidden" name="csrf" value={data.csrf} />
    <h2>Portada</h2>
    <label>Nombre de la causa <input name="causeName" value={data.home.causeName} required /></label>
    <label>Imagen principal <input name="heroImageUrl" value={data.home.heroImageUrl} required /></label>
    <label>Texto alternativo <input name="heroImageAlt" value={data.home.heroImageAlt} required /></label>
    <label>Resumen <textarea name="problemSummary" required>{data.home.problemSummary}</textarea></label>
    <label>Llamado a la acción <textarea name="callToAction" required>{data.home.callToAction}</textarea></label>
    <button type="submit">Guardar portada</button>
  </form>
  <h2>Menú</h2>
  <div class="grid">
    {#each [...data.menu, { id: '', label: '', href: '', position: data.menu.length + 1, visible: true }] as item}
      <form class="card form-stack" method="POST" action="?/menu">
        <input type="hidden" name="csrf" value={data.csrf} />
        <input type="hidden" name="id" value={item.id} />
        <label>Etiqueta <input name="label" value={item.label} required /></label>
        <label>URL <input name="href" value={item.href} required /></label>
        <label>Orden <input type="number" name="position" value={item.position} /></label>
        <label><span><input type="checkbox" name="visible" checked={item.visible} /> Visible</span></label>
        <button type="submit">Guardar</button>
      </form>
    {/each}
  </div>
</section>
