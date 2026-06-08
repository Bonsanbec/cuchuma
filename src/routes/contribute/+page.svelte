<script lang="ts">
  let { data, form } = $props();
</script>

<main>
  <section class="story-hero" aria-labelledby="contribute-title">
    <div>
      <p class="eyebrow">Aportar memoria o documentación</p>
      <h1 id="contribute-title">Lo que sabes puede ayudar a cuidar la historia.</h1>
      <p class="lead">Comparte un relato, una fotografía, un documento o un enlace. El equipo revisará el material antes de publicarlo.</p>
    </div>
    <img class="hero-mark" src="/identity/kuchumá.png" alt="Silueta de El Cuchumá" />
  </section>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="form-stack document-panel" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value={data.csrf} />
    <label>Título <input name="title" required /></label>
    <label>Qué quieres compartir
      <select name="type" required>
        <option value="MEMORY">Un recuerdo o testimonio</option>
        <option value="EVIDENCE">Un documento o evidencia</option>
      </select>
    </label>
    <label>Tema aproximado
      <select name="categoryId">
        <option value="">No estoy seguro</option>
        {#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}
      </select>
    </label>
    <label>Relato o descripción <textarea name="body" required></textarea></label>
    <label>Enlaces relacionados <textarea name="externalLinks"></textarea></label>
    <label>Archivos <input type="file" name="files" multiple accept="image/*,video/*,audio/*,application/pdf,text/plain" /></label>
    <button type="submit">Enviar para revisión</button>
  </form>
</main>
