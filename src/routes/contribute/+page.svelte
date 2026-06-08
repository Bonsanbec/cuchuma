<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <h1>Nueva contribución</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="form-stack" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Título <input name="title" required /></label>
    <label>Clasificación
      <select name="type" required>
        <option value="MEMORY">Recuerdo</option>
        <option value="EVIDENCE">Evidencia</option>
      </select>
    </label>
    <label>Categoría
      <select name="categoryId">
        <option value="">Sin categoría</option>
        {#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}
      </select>
    </label>
    <label>Texto <textarea name="body" required></textarea></label>
    <label>Enlaces externos <textarea name="externalLinks"></textarea></label>
    <label>Archivos multimedia <input type="file" name="files" multiple accept="image/*,video/*,audio/*,application/pdf,text/plain" /></label>
    <button type="submit">Enviar a moderación</button>
  </form>
</main>
