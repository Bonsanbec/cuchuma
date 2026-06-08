<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Contenido y moderación</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <div class="grid">
    <form class="card form-stack" method="POST" action="?/article">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>Nueva nota periodística</h2>
      <label>Título <input name="title" required /></label>
      <label>Medio <input name="outlet" required /></label>
      <label>Autor <input name="authorName" /></label>
      <label>Fecha <input type="date" name="publishedOn" required /></label>
      <label>URL <input type="url" name="url" required /></label>
      <label>Categoría <select name="categoryId"><option value="">Sin categoría</option>{#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}</select></label>
      <label>Resumen <textarea name="summary" required></textarea></label>
      <button type="submit">Guardar nota</button>
    </form>
    <form class="card form-stack" method="POST" action="?/reflection">
      <input type="hidden" name="csrf" value={data.csrf} />
      <h2>Nueva reflexión o documento</h2>
      <label>Título <input name="title" required /></label>
      <label>Categoría <select name="categoryId"><option value="">Sin categoría</option>{#each data.categories as category}<option value={category.id}>{category.name}</option>{/each}</select></label>
      <label>Texto <textarea name="body" required></textarea></label>
      <button type="submit">Publicar</button>
    </form>
  </div>
  <form class="card form-stack" method="POST" action="?/category">
    <input type="hidden" name="csrf" value={data.csrf} />
    <h2>Categorías</h2>
    <div class="two-col">
      <label>Nombre <input name="name" required /></label>
      <label>Descripción <input name="description" /></label>
    </div>
    <button type="submit">Guardar categoría</button>
  </form>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Contenido</th><th>Estado</th><th>Moderación</th></tr></thead>
      <tbody>
        {#each data.contributions as item}
          <tr>
            <td>{item.title}<br /><span class="meta">Contribución · {item.author.name} · {item.category?.name ?? 'Sin categoría'}</span></td>
            <td>{item.status}</td>
            <td>
              <form method="POST" action="?/moderate" class="form-stack">
                <input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="contribution" /><input type="hidden" name="id" value={item.id} />
                <textarea name="rejectionNote"></textarea>
                <button name="status" value="APPROVED">Aprobar</button><button class="danger" name="status" value="REJECTED">Rechazar</button>
              </form>
            </td>
          </tr>
        {/each}
        {#each data.articles as item}
          <tr><td>{item.title}<br /><span class="meta">Nota · {item.outlet}</span></td><td>{item.status}</td><td><form method="POST" action="?/moderate"><input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="article" /><input type="hidden" name="id" value={item.id} /><button name="status" value="APPROVED">Aprobar</button> <button class="danger" name="status" value="REJECTED">Rechazar</button></form></td></tr>
        {/each}
        {#each data.reflections as item}
          <tr><td>{item.title}<br /><span class="meta">Texto</span></td><td>{item.status}</td><td><form method="POST" action="?/moderate"><input type="hidden" name="csrf" value={data.csrf} /><input type="hidden" name="entity" value="reflection" /><input type="hidden" name="id" value={item.id} /><button name="status" value="APPROVED">Aprobar</button> <button class="danger" name="status" value="REJECTED">Rechazar</button></form></td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
