<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Multimedia</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="card form-stack" method="POST" enctype="multipart/form-data" action="?/upload">
    <input type="hidden" name="csrf" value={data.csrf} />
    <div class="two-col">
      <label>Título <input name="title" /></label>
      <label>Texto alternativo <input name="altText" /></label>
    </div>
    <label>Descripción <textarea name="description"></textarea></label>
    <label>Archivo <input type="file" name="file" accept="image/*,video/*,audio/*,application/pdf,text/plain" required /></label>
    <button type="submit">Cargar archivo</button>
  </form>
  <div class="grid">
    {#each data.media as file}
      <article class="card">
        <h2>{file.title}</h2>
        <p class="meta">{file.kind} · {file.mimeType} · {Math.round(file.sizeBytes / 1024)} KB · {file.author.name} · {new Date(file.createdAt).toLocaleDateString('es-MX')}</p>
        {#if file.kind === 'IMAGE'}<img src={file.publicUrl} alt={file.altText ?? file.title} loading="lazy" />{/if}
        {#if file.kind === 'VIDEO'}<video src={file.publicUrl} controls preload="metadata"><track kind="captions" /></video>{/if}
        {#if file.kind === 'AUDIO'}<audio src={file.publicUrl} controls></audio>{/if}
        {#if file.kind === 'DOCUMENT'}<a href={file.publicUrl} target="_blank" rel="noreferrer">Ver documento</a>{/if}
      </article>
    {/each}
  </div>
</section>
